import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { O as freezeDiagnosticTraceContext, P as runWithDiagnosticTraceContext, T as createDiagnosticTraceContext, c as emitTrustedDiagnosticEventWithPrivateData, k as getActiveDiagnosticTraceContext, s as emitTrustedDiagnosticEvent, w as createChildDiagnosticTraceContext } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { _ as resolveSessionAgentIds } from "./agent-scope-DXrnO3F4.mjs";
import { a as isRuntimeToolAllowed, o as isToolAllowedByPolicies } from "./tool-policy-match--5jlhAPZ.mjs";
import { _ as resolveAdmittedRunActiveAssertion, g as readRunOperatorAuthority, n as assertOperatorModelAllowed, r as bindOperatorModelExecution } from "./admitted-run-context-h1ULFETN.mjs";
import { s as recordAgentHarnessPreflightOwner, t as AgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
import "./config-B3oiWDlr.mjs";
import { a as resolveAgentHarnessPreparedRouteSupport, i as resolveAgentHarnessPreparedAuthSupport, t as assertPluginHarnessConversationToolPolicySupport } from "./support-CqB31PZB.mjs";
import "./availability-CUqXgij4.mjs";
import { i as hasGlobalHooks } from "./hook-runner-global-yjqy4fXI.mjs";
import { l as normalizeAgentRunAttemptTerminal, u as projectAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { n as truncateDiagnosticContent, t as joinDiagnosticContent } from "./diagnostic-content-DwhKdbod.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { i as unwrapSecretSentinelsForProviderEgress, r as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-CQZW-nmd.mjs";
import { r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-Dt79CD6m.mjs";
import { i as hasInternalHookListeners } from "./internal-hooks-DNLQqCT3.mjs";
import { r as assertContextEngineHostSupport } from "./host-compat-DWLjZN89.mjs";
import { r as resolveAgentHarnessSelectionDecision, t as buildAgentHarnessSelectionDecision } from "./selection-decision-CRh-vMBN.mjs";
import { i as runWithAgentRingZeroTools, n as isHostScopedAgentToolActive } from "./agent-tools.ring-zero-context-DcmTQndF.mjs";
import { a as preparePluginHarnessToolPolicies, c as resolvePluginHarnessToolPolicies, n as isSystemAgentOnlyAllowlist, s as resolvePluginHarnessDenyAllToolPolicyPrompt, t as assertAgentHarnessExecutionEnvironment } from "./execution-environment-DP1yYe5g.mjs";
import { a as prepareActiveNodeContext } from "./active-node-context-DpQMef3G.mjs";
import { t as createAgentHarnessHostCapabilities } from "./host-capability-CtHEkIpy.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-BarAnCx4.mjs";
import { t as copyCoreTtsAttemptResultProvenance } from "./tts-tool-result-provenance-BbSbWcUn.mjs";
import { t as claimHeartbeatContextForUserRun } from "./heartbeat-outcome-store-DsHDfEuS.mjs";
import { t as appendCurrentInboundContext } from "./runtime-context-prompt-D_5rC-8c.mjs";
import { n as isBuiltInOpenClawAgentHarness, t as createOpenClawAgentHarness } from "./builtin-openclaw-CMvbELtK.mjs";
import { d as resolveFinalMessageRawText, l as resolveFinalAssistantRawText } from "./helpers-3t21Jnao.mjs";
import { i as EmptySettledTurnFinalizationError, t as assertSettledTurnFinalizationResult } from "./settled-turn-finalization-result-DJqqJfy5.mjs";
import { t as beginContextEngineLogicalTurn } from "./context-engine-turn-begin-BnNzqIXZ.mjs";
import { t as subscribeAgentCommentaryDiagnostics } from "./commentary-diagnostics-hgZXAMgx.mjs";
//#region src/agents/harness/result-classification.ts
/** Applies a harness classifier while replacing any stale prior classification. */
function applyAgentHarnessResultClassification(harness, result, params) {
	if (!harness.classify) return {
		...result,
		agentHarnessId: harness.id
	};
	const { agentHarnessResultClassification: _previousClassification, ...resultWithoutPrevious } = result;
	const classification = harness.classify(resultWithoutPrevious, params);
	return {
		...resultWithoutPrevious,
		agentHarnessId: harness.id,
		...classification && classification !== "ok" ? { agentHarnessResultClassification: classification } : {}
	};
}
//#endregion
//#region src/agents/harness/lifecycle.ts
/** Gated, bounded prompt/answer for child run.completed, like embedded and CLI runs. */
function agentRunMessageContent(prompt, assistant) {
	const policy = resolveDiagnosticModelContentCapturePolicy(getRuntimeConfigSnapshot());
	const finalText = policy.outputMessages ? resolveFinalMessageRawText(assistant) : void 0;
	const finalResponse = finalText ? joinDiagnosticContent([finalText]) : void 0;
	const userPrompt = policy.inputMessages && prompt ? truncateDiagnosticContent(prompt) : void 0;
	return userPrompt || finalResponse ? {
		...userPrompt ? { userPrompt } : {},
		...finalResponse ? { finalResponse } : {}
	} : void 0;
}
function assertAgentHarnessContextEngineSupport(harness, params) {
	if (!params.contextEngine || params.contextEngine.info.id === "legacy") return;
	assertContextEngineHostSupport({
		contextEngine: params.contextEngine,
		operation: "agent-run",
		host: {
			id: `agent-harness:${harness.id}`,
			label: `agent harness "${harness.id}"`,
			capabilities: harness.contextEngineHostCapabilities ?? []
		}
	});
}
function agentHarnessDiagnosticBase(harness, params, trace) {
	const diagnosticTrace = trace ?? getActiveDiagnosticTraceContext();
	const channel = params.messageChannel ?? params.messageProvider;
	return {
		runId: params.runId,
		sessionId: params.sessionId,
		...params.agentId ? { agentId: params.agentId } : {},
		provider: params.provider,
		model: params.modelId,
		harnessId: harness.id,
		...harness.pluginId ? { pluginId: harness.pluginId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.trigger ? { trigger: params.trigger } : {},
		...channel ? { channel } : {},
		...diagnosticTrace ? { trace: freezeDiagnosticTraceContext(diagnosticTrace) } : {}
	};
}
function normalizeAgentHarnessAttemptResult(result) {
	const { aborted, externalAbort, idleTimedOut, promptError, promptErrorSource, timedOut, timedOutByRunBudget, timedOutDuringCompaction, timedOutDuringToolExecution, ...canonical } = result;
	const currentAttemptProvenance = Object.hasOwn(result, "currentAttemptAssistant") ? { currentAttemptAssistant: result.currentAttemptAssistant } : result.lastAssistant ? { currentAttemptAssistant: result.lastAssistant } : {};
	const canonicalWithAttemptProvenance = {
		...canonical,
		...currentAttemptProvenance
	};
	if ("terminal" in canonicalWithAttemptProvenance) return canonicalWithAttemptProvenance;
	const terminal = normalizeAgentRunAttemptTerminal({
		aborted,
		externalAbort,
		idleTimedOut,
		promptError,
		promptErrorSource,
		timedOut,
		timedOutByRunBudget,
		timedOutDuringCompaction,
		timedOutDuringToolExecution
	});
	return {
		...canonicalWithAttemptProvenance,
		terminal
	};
}
function agentRunDiagnosticBase(params, trace) {
	const channel = params.messageChannel ?? params.messageProvider;
	return {
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.sessionId ? { sessionId: params.sessionId } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		provider: params.provider,
		model: params.modelId,
		...params.trigger ? { trigger: params.trigger } : {},
		...channel ? { channel } : {},
		trace
	};
}
function emitAgentRunCompleted(params, trace, startedAt, completion, classifyMissingError = false) {
	if (!trace) return;
	const failed = completion.outcome === "error" && (completion.error != null || classifyMissingError);
	const errorMessage = failed ? diagnosticErrorMessage(completion.error) : void 0;
	emitTrustedDiagnosticEventWithPrivateData({
		type: "run.completed",
		...agentRunDiagnosticBase(params, trace),
		durationMs: Date.now() - startedAt,
		outcome: completion.outcome,
		...completion.blockedBy ? { blockedBy: completion.blockedBy } : {},
		...failed ? { errorCategory: diagnosticErrorCategory(completion.error) } : {}
	}, errorMessage || completion.messageContent ? {
		...errorMessage ? { errorMessage } : {},
		...completion.messageContent ? { messageContent: completion.messageContent } : {}
	} : void 0);
}
function agentRunCompletion(result) {
	const terminal = projectAgentRunAttemptTerminal(result.terminal);
	if (terminal.timedOut || terminal.externalAbort || terminal.aborted) return { outcome: "aborted" };
	if (terminal.promptErrorSource === "hook:before_agent_run") return {
		outcome: "blocked",
		blockedBy: "before_agent_run"
	};
	if (terminal.promptErrorSource !== null) return {
		outcome: "error",
		error: terminal.promptError
	};
	return { outcome: "completed" };
}
function withFallbackDiagnosticTrace(result, trace) {
	if (result.diagnosticTrace || !trace) return result;
	return copyCoreTtsAttemptResultProvenance(result, {
		...result,
		diagnosticTrace: freezeDiagnosticTraceContext(trace)
	});
}
function emitAgentHarnessRunCompleted(params) {
	const { harness, attemptParams, result, startedAt, trace } = params;
	const completion = agentRunCompletion(result);
	const terminal = projectAgentRunAttemptTerminal(result.terminal);
	const outcome = terminal.timedOut ? "timed_out" : completion.outcome === "blocked" ? "error" : completion.outcome;
	const errorMessage = outcome === "error" ? diagnosticErrorMessage(terminal.promptError) : void 0;
	const finalAssistantText = resolveDiagnosticModelContentCapturePolicy(getRuntimeConfigSnapshot()).outputMessages ? resolveFinalMessageRawText(result.currentAttemptAssistant ?? result.currentAttemptCompletedAssistant) : void 0;
	const finalResponse = finalAssistantText ? joinDiagnosticContent([finalAssistantText]) : void 0;
	const harnessContent = finalResponse ? { finalResponse } : void 0;
	emitTrustedDiagnosticEventWithPrivateData({
		type: "harness.run.completed",
		...agentHarnessDiagnosticBase(harness, attemptParams, trace ?? result.diagnosticTrace),
		durationMs: Date.now() - startedAt,
		outcome,
		...result.agentHarnessResultClassification ? { resultClassification: result.agentHarnessResultClassification } : {},
		...typeof result.yieldDetected === "boolean" ? { yieldDetected: result.yieldDetected } : {},
		itemLifecycle: { ...result.itemLifecycle }
	}, {
		...errorMessage ? { errorMessage } : {},
		...harnessContent ? { harnessContent } : {}
	});
}
function createAgentHarnessLifecycleDiagnostics(harness, params, finalizing = false) {
	const startedAt = Date.now();
	const trace = getActiveDiagnosticTraceContext();
	const createRunTrace = () => harness.id !== "openclaw" && trace ? freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(trace)) : void 0;
	let agentRunTrace = finalizing ? createRunTrace() : void 0;
	let agentRunStartedAt = finalizing ? startedAt : 0;
	let phase = "prepare";
	const harnessContent = resolveDiagnosticModelContentCapturePolicy(getRuntimeConfigSnapshot()).inputMessages && params.prompt ? { userPrompt: truncateDiagnosticContent(params.prompt) } : void 0;
	emitTrustedDiagnosticEventWithPrivateData({
		type: "harness.run.started",
		...agentHarnessDiagnosticBase(harness, params, trace)
	}, harnessContent ? { harnessContent } : void 0);
	const unsubscribe = subscribeAgentCommentaryDiagnostics(params.config, agentHarnessDiagnosticBase(harness, params, trace));
	const complete = (completion, classifyMissingError = false) => emitAgentRunCompleted(params, agentRunTrace, agentRunStartedAt, completion, classifyMissingError);
	return {
		startedAt,
		trace,
		unsubscribe,
		complete,
		setPhase(value) {
			phase = value;
		},
		startAgentRun() {
			if (!finalizing) {
				agentRunTrace = createRunTrace();
				if (agentRunTrace) agentRunStartedAt = Date.now();
			}
			if (agentRunTrace) emitTrustedDiagnosticEvent({
				type: "run.started",
				...agentRunDiagnosticBase(params, agentRunTrace)
			});
		},
		run(execute) {
			return agentRunTrace ? runWithDiagnosticTraceContext(agentRunTrace, execute) : execute();
		},
		fail(error) {
			if (!finalizing) recordAgentHarnessPreflightOwner(error, harness.id);
			const errorMessage = diagnosticErrorMessage(error);
			emitTrustedDiagnosticEventWithPrivateData({
				type: "harness.run.error",
				...agentHarnessDiagnosticBase(harness, params, trace),
				durationMs: Date.now() - startedAt,
				phase,
				errorCategory: diagnosticErrorCategory(error)
			}, errorMessage ? { errorMessage } : void 0);
			complete({
				outcome: "error",
				error,
				messageContent: agentRunMessageContent(params.prompt)
			}, finalizing);
		}
	};
}
async function runAgentHarnessLifecycleAttempt(harness, params, execute = (attemptParams) => harness.runAttempt(attemptParams)) {
	let result;
	const diagnostics = createAgentHarnessLifecycleDiagnostics(harness, params);
	try {
		assertAgentHarnessContextEngineSupport(harness, params);
		diagnostics.startAgentRun();
		const runAndClassify = async () => {
			diagnostics.setPhase("send");
			const rawResult = await execute(params);
			diagnostics.setPhase("resolve");
			return copyCoreTtsAttemptResultProvenance(rawResult, normalizeAgentHarnessAttemptResult(applyAgentHarnessResultClassification(harness, rawResult, params)));
		};
		result = await diagnostics.run(runAndClassify);
		result = withFallbackDiagnosticTrace(result, diagnostics.trace);
	} catch (error) {
		diagnostics.fail(error);
		throw error;
	} finally {
		diagnostics.unsubscribe();
	}
	diagnostics.complete({
		...agentRunCompletion(result),
		messageContent: agentRunMessageContent(params.prompt, result.currentAttemptAssistant ?? result.currentAttemptCompletedAssistant)
	});
	emitAgentHarnessRunCompleted({
		harness,
		attemptParams: params,
		result,
		startedAt: diagnostics.startedAt,
		trace: diagnostics.trace
	});
	return result;
}
async function runAgentHarnessLifecycleFinalization(harness, params, execute) {
	const diagnostics = createAgentHarnessLifecycleDiagnostics(harness, params, true);
	diagnostics.startAgentRun();
	try {
		const runAndValidate = async () => {
			diagnostics.setPhase("send");
			try {
				const rawResult = await execute();
				diagnostics.setPhase("resolve");
				return {
					outcome: "answered",
					result: assertSettledTurnFinalizationResult(rawResult)
				};
			} catch (error) {
				if (error instanceof EmptySettledTurnFinalizationError) return {
					outcome: "empty",
					result: error.result
				};
				throw error;
			}
		};
		const rawResult = await diagnostics.run(runAndValidate);
		const result = {
			...rawResult,
			result: rawResult.result.diagnosticTrace || !diagnostics.trace ? rawResult.result : {
				...rawResult.result,
				diagnosticTrace: freezeDiagnosticTraceContext(diagnostics.trace)
			}
		};
		diagnostics.complete({
			outcome: "completed",
			messageContent: agentRunMessageContent(params.prompt, result.result.assistant)
		});
		const finalizationVisibleText = resolveDiagnosticModelContentCapturePolicy(getRuntimeConfigSnapshot()).outputMessages ? resolveFinalAssistantRawText(result.result.assistant) : void 0;
		const finalizationResponseText = finalizationVisibleText ? joinDiagnosticContent([finalizationVisibleText]) : void 0;
		emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.completed",
			...agentHarnessDiagnosticBase(harness, params, result.result.diagnosticTrace ?? diagnostics.trace),
			durationMs: Date.now() - diagnostics.startedAt,
			outcome: "completed",
			itemLifecycle: {
				startedCount: 0,
				completedCount: 0,
				activeCount: 0
			}
		}, finalizationResponseText ? { harnessContent: { finalResponse: finalizationResponseText } } : void 0);
		return result;
	} catch (error) {
		diagnostics.fail(error);
		throw error;
	} finally {
		diagnostics.unsubscribe();
	}
}
//#endregion
//#region src/agents/harness/plugin-private-state.ts
function withoutPluginHarnessPrivateState(params) {
	const { admittedRunContext: _admittedRunContext, thinkingExplicit: _thinkingExplicit, runtimePluginToolGrant: _runtimePluginToolGrant, assistantErrorTranscript: _assistantErrorTranscript, compactionCountOwner: _compactionCountOwner, completionCheck: _completionCheck, preparedSessionTarget: _preparedSessionTarget, onContextAccountingEvent: _onContextAccountingEvent, onCompactionRequestBudget: _onCompactionRequestBudget, contextEngineLogicalTurnLease: _contextEngineLogicalTurnLease, hostCapabilities: _hostCapabilities, onContextEngineTurnCandidate: _onContextEngineTurnCandidate, trajectoryRecorder: _trajectoryRecorder, inputAttachmentMedia: _inputAttachmentMedia, supportsTurnScopedToolRestrictions: _supportsTurnScopedToolRestrictions, __openclawSourceReplyDeliveryRuntime: _sourceReplyDeliveryRuntime, ...pluginParams } = params;
	return pluginParams;
}
//#endregion
//#region src/agents/harness/selection.ts
/**
* Selects and invokes native agent harnesses for embedded run attempts.
*/
const log = createSubsystemLogger("agents/harness");
const WORKSPACE_EFFECT_HOOKS = [
	"agent_turn_prepare",
	"before_prompt_build",
	"before_agent_run",
	"llm_input",
	"llm_output",
	"before_agent_finalize",
	"agent_end",
	"before_message_write",
	"tool_result_persist",
	"before_compaction",
	"after_compaction"
];
function selectAgentHarness(params) {
	return selectAgentHarnessDecision(params).harness;
}
/** Selects one harness that can preserve every prepared route/auth retry candidate. */
function selectAgentHarnessForPreparedModelProviders(params) {
	const { modelProviders, ...selectionParams } = params;
	if (modelProviders.length === 0) return selectAgentHarness(selectionParams);
	const decisions = modelProviders.map((modelProvider) => selectAgentHarnessDecision({
		...selectionParams,
		modelProvider,
		preparedModelProvider: true
	}));
	const first = decisions[0];
	if (!first || decisions.every((decision) => decision.selectedHarnessId === first.selectedHarnessId)) return first?.harness ?? selectAgentHarness(selectionParams);
	return decisions.find((decision) => decision.selectedHarnessId === "openclaw")?.harness ?? createOpenClawAgentHarness();
}
function selectAgentHarnessDecision(params) {
	const selection = resolveAgentHarnessSelectionDecision(params);
	return {
		...selection,
		harness: selection.builtIn ? createOpenClawAgentHarness() : selection.harness
	};
}
/** Runs the selected harness's fail-closed settled-turn finalization operation. */
async function runAgentHarnessSettledTurnFinalization(params, settledAttempt, harness) {
	const internalParams = params;
	const finalizeSettledTurn = harness.finalizeSettledTurn?.bind(harness);
	if (!finalizeSettledTurn) throw new Error(`Agent harness ${harness.id} cannot safely finalize a settled tool turn.`);
	if (internalParams.systemAgentTool && !isSystemAgentOnlyAllowlist(internalParams.toolsAllow)) throw new Error("OpenClaw host authority requires toolsAllow: [\"openclaw\"]");
	const builtIn = isBuiltInOpenClawAgentHarness(harness);
	const operatorAuthority = assertHarnessModelPolicySupport(harness, params);
	const modelExecution = builtIn ? void 0 : bindOperatorModelExecution(operatorAuthority, harness.nativeModelPolicySupport === "exact" ? settledAttempt.runtimeModelSelection ?? {
		provider: params.provider,
		model: params.modelId
	} : void 0);
	try {
		modelExecution?.assertCurrent();
		const attemptParams = prepareHarnessFinalizationParams({
			...internalParams,
			operation: "settled-tool-finalization",
			abortSignal: modelExecution ? params.abortSignal ? AbortSignal.any([params.abortSignal, modelExecution.signal]) : modelExecution.signal : params.abortSignal
		}, builtIn);
		const result = await runAgentHarnessOperation(harness, params, () => runWithAgentRingZeroTools([], () => runAgentHarnessLifecycleFinalization(harness, attemptParams, () => {
			assertHarnessModelPolicySupport(harness, params);
			modelExecution?.assertCurrent();
			return finalizeSettledTurn({
				attempt: attemptParams,
				settledAttempt
			});
		})));
		modelExecution?.assertCurrent();
		return result;
	} finally {
		modelExecution?.release();
	}
}
async function runAgentHarnessAttempt(params, nativeSessionRuntime) {
	let internalParams = params;
	if (nativeSessionRuntime) await nativeSessionRuntime.assertCurrent();
	else assertOperatorModelAllowed(readRunOperatorAuthority(params), {
		provider: params.provider,
		model: params.modelId
	});
	const selection = nativeSessionRuntime?.auth === "native" ? {
		...buildAgentHarnessSelectionDecision({
			harness: isBuiltInOpenClawAgentHarness(nativeSessionRuntime.harness) ? void 0 : nativeSessionRuntime.harness,
			policy: {
				runtime: nativeSessionRuntime.harness.id,
				runtimeSource: "model"
			},
			selectedReason: "forced_plugin",
			candidates: []
		}),
		harness: nativeSessionRuntime.harness
	} : selectPreparedAgentHarness(params);
	const harness = selection.harness;
	const nativeOwnsModel = nativeSessionRuntime?.auth === "native";
	const nativeModelPolicySupported = harness.nativeModelPolicySupport === "exact";
	assertHarnessModelPolicySupport(harness, params);
	const runPreparedAttempt = async (prepared) => {
		if (nativeSessionRuntime) await nativeSessionRuntime.assertCurrent();
		else assertOperatorModelAllowed(readRunOperatorAuthority(params), {
			provider: params.provider,
			model: params.modelId
		});
		const operatorAuthority = assertHarnessModelPolicySupport(harness, params);
		const modelExecution = selection.builtIn || nativeOwnsModel && nativeModelPolicySupported ? void 0 : bindOperatorModelExecution(operatorAuthority, !nativeModelPolicySupported ? void 0 : nativeSessionRuntime ? nativeSessionRuntime.modelRef : {
			provider: params.provider,
			model: params.modelId
		});
		try {
			modelExecution?.assertCurrent();
			const result = await runAgentHarnessLifecycleAttempt(harness, modelExecution ? {
				...prepared,
				abortSignal: prepared.abortSignal ? AbortSignal.any([prepared.abortSignal, modelExecution.signal]) : modelExecution.signal
			} : prepared);
			await nativeSessionRuntime?.assertCurrent();
			modelExecution?.assertCurrent();
			return result;
		} finally {
			modelExecution?.release();
		}
	};
	if (nativeSessionRuntime && harness !== nativeSessionRuntime.harness) throw new AgentHarnessPreflightError("Native session runtime changed before dispatch. Reattach the original native session before retrying.");
	if (internalParams.contextEngineLogicalTurnLease) {
		const effective = await beginContextEngineLogicalTurn({
			lease: internalParams.contextEngineLogicalTurnLease,
			host: {
				id: `agent-harness:${harness.id}`,
				label: `agent harness "${harness.id}"`,
				capabilities: harness.contextEngineHostCapabilities ?? []
			},
			recorder: internalParams.userTurnTranscriptRecorder,
			isHeartbeat: isHeartbeatLifecycleRunKind(internalParams.bootstrapContextRunKind),
			sessionTarget: internalParams.sessionTarget
		});
		internalParams = {
			...internalParams,
			contextEngine: effective.engine.info.id === "legacy" ? void 0 : effective.engine
		};
	}
	if (internalParams.systemAgentTool && !isSystemAgentOnlyAllowlist(internalParams.toolsAllow)) throw new Error("OpenClaw host authority requires toolsAllow: [\"openclaw\"]");
	const ringZeroTools = internalParams.systemAgentTool ? [(await import("./system-agent-tool-AtWx0Een.mjs")).createSystemAgentTool(internalParams.systemAgentTool)] : [];
	const recorder = !selection.builtIn && !internalParams.suppressNextUserMessagePersistence ? internalParams.userTurnTranscriptRecorder : void 0;
	const awaitBaseline = internalParams.awaitSessionDiffBaseline;
	if (recorder || awaitBaseline && (!selection.builtIn || WORKSPACE_EFFECT_HOOKS.some((hook) => hasGlobalHooks(hook)) || internalParams.trigger === "heartbeat" && hasGlobalHooks("heartbeat_prompt_contribution") || hasInternalHookListeners("agent", "bootstrap"))) {
		const assertCurrent = resolveAdmittedRunActiveAssertion(internalParams.admittedRunContext, internalParams.abortSignal);
		if (!assertCurrent) throw new Error("agent harness requires active admitted run authority");
		assertCurrent();
		await awaitBaseline?.();
		internalParams.abortSignal?.throwIfAborted();
		assertCurrent();
		if (recorder) {
			await recorder.persistApproved({ cwd: internalParams.cwd ?? internalParams.workspaceDir });
			assertCurrent();
		}
	}
	if (nativeSessionRuntime) await nativeSessionRuntime.assertCurrent();
	const { contextEngineLogicalTurnLease: _contextEngineLogicalTurnLease, systemAgentTool: _systemAgentTool, ...attemptParams } = internalParams;
	const pluginAttempt = withoutInternalHarnessAuthority(attemptParams, harness, selection.builtIn, selection.ownerPluginId);
	logAgentHarnessSelection(selection, {
		provider: params.provider,
		modelId: params.modelId,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	let result;
	try {
		result = await runAgentHarnessOperation(harness, params, () => runWithAgentRingZeroTools(ringZeroTools, async () => {
			const hostOpenClawAuthority = isHostScopedAgentToolActive("openclaw") && isSystemAgentOnlyAllowlist(pluginAttempt.params.toolsAllow);
			const nativePermissionsConsented = await assertAgentHarnessExecutionEnvironment(harness, params);
			const preparedParams = selection.builtIn ? pluginAttempt.params : await preparePluginHarnessParams(pluginAttempt.params, harness, nativePermissionsConsented, pluginAttempt.setInputAttachmentReadAllowed, attemptParams.runtimePluginToolGrant !== void 0);
			const effectiveAttemptParams = hostOpenClawAuthority && preparedParams.pluginHarnessToolPolicyRestricted ? {
				...preparedParams,
				pluginHarnessToolPolicyRestricted: false
			} : preparedParams;
			assertPluginHarnessConversationToolPolicySupport(harness, effectiveAttemptParams.pluginHarnessToolPolicyRestricted === true && !nativePermissionsConsented);
			return import("./tool-authority.runtime.js").then(({ withPreparedEmbeddedRunToolAuthority }) => withPreparedEmbeddedRunToolAuthority(internalParams, effectiveAttemptParams, selection.builtIn ? void 0 : (input, sandbox) => {
				const policies = resolvePluginHarnessToolPolicies({
					...input.run,
					modelId: input.run.model,
					sandboxSessionKey: input.run.runtimePolicySessionKey,
					messageChannel: input.originatingChannel,
					toolsAllow: input.toolsAllow,
					disableTools: input.disableTools
				}, void 0, void 0, sandbox);
				return resolvePluginHarnessDenyAllToolPolicyPrompt(policies) ? {
					...input,
					toolsAllow: []
				} : input;
			}, (prepared) => pluginAttempt.runWithHostScope(async () => {
				if (prepared.trigger !== "user" || !prepared.sessionKey) return runPreparedAttempt(prepared);
				const note = await claimHeartbeatContextForUserRun({
					...prepared,
					agentId: resolveSessionAgentIds(prepared).sessionAgentId,
					storePath: prepared.sessionTarget?.storePath,
					detached: prepared.sessionPersistence === "detached",
					assertCurrent: resolveAdmittedRunActiveAssertion(internalParams.admittedRunContext, prepared.abortSignal)
				});
				if (!note) return runPreparedAttempt(prepared);
				return runPreparedAttempt({
					...prepared,
					currentInboundContext: appendCurrentInboundContext(prepared.currentInboundContext, [{
						kind: "heartbeat-outcome",
						text: note
					}])
				});
			})));
		}));
	} finally {
		pluginAttempt.closeHostCapabilities();
	}
	const admission = internalParams.userTurnTranscriptRecorder?.getAdmissionReceipt();
	if (internalParams.onContextEngineTurnCandidate && admission && result.contextEngineTerminalAnchor) internalParams.onContextEngineTurnCandidate({
		boundary: {
			admission,
			terminal: result.contextEngineTerminalAnchor
		},
		sessionIdUsed: result.sessionIdUsed,
		sessionKey: internalParams.sessionKey,
		sessionTarget: internalParams.sessionTarget,
		promptError: result.terminal.kind === "failed",
		aborted: result.terminal.kind === "aborted" || result.terminal.kind === "timeout" && "aborted" in result.terminal && result.terminal.aborted === true,
		yieldAborted: result.terminal.kind === "aborted" && result.terminal.source === "yield_cleanup",
		isHeartbeat: isHeartbeatLifecycleRunKind(internalParams.bootstrapContextRunKind),
		runtimeContext: nativeSessionRuntime && result.runtimeModelSelection ? {
			provider: result.runtimeModelSelection.provider,
			modelId: result.runtimeModelSelection.model
		} : {
			provider: internalParams.provider,
			modelId: internalParams.modelId,
			modelContextWindow: internalParams.modelContextWindow,
			tokenBudget: internalParams.contextTokenBudget
		}
	});
	const { contextEngineTerminalAnchor: _contextEngineTerminalAnchor, ...publicResult } = result;
	return copyCoreTtsAttemptResultProvenance(result, publicResult);
}
function assertHarnessModelPolicySupport(harness, params) {
	const authority = readRunOperatorAuthority(params);
	authority?.assertCurrent();
	if (!isBuiltInOpenClawAgentHarness(harness) && authority?.modelPolicy && harness.nativeModelPolicySupport !== "exact") throw new AgentHarnessPreflightError(`Agent harness ${harness.id} cannot enforce your operator role's model policy. Choose a compatible runtime or ask a gateway administrator to update the harness.`);
	return authority;
}
function selectPreparedAgentHarness(params) {
	return selectAgentHarnessDecision({
		provider: params.provider,
		modelId: params.modelId,
		modelProvider: {
			api: params.model.api,
			baseUrl: params.model.baseUrl,
			...resolveAgentHarnessPreparedRouteSupport(params.runtimePlan?.auth),
			preparedAuth: resolveAgentHarnessPreparedAuthSupport({ plan: params.runtimePlan?.auth })
		},
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		agentHarnessId: params.agentHarnessId,
		agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride,
		preparedModelProvider: params.runtimePlan?.auth !== void 0
	});
}
async function runAgentHarnessOperation(harness, params, execute) {
	await prepareActiveNodeContext(readRunOperatorAuthority(params)?.profileId);
	resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal)?.();
	const activeTrace = getActiveDiagnosticTraceContext();
	const harnessTrace = freezeDiagnosticTraceContext(activeTrace ? createChildDiagnosticTraceContext(activeTrace) : createDiagnosticTraceContext());
	const builtIn = isBuiltInOpenClawAgentHarness(harness);
	try {
		return await runWithDiagnosticTraceContext(harnessTrace, execute);
	} catch (error) {
		if (!builtIn) log.warn(`${harness.label} failed; not falling back to embedded OpenClaw backend`, {
			harnessId: harness.id,
			provider: params.provider,
			modelId: params.modelId,
			error: formatErrorMessage(error)
		});
		throw error;
	}
}
function withoutInternalHarnessAuthority(params, harness, builtIn, ownerPluginId) {
	if (builtIn) return {
		params: {
			...params,
			operationalRunInstance: params.admittedRunContext.operationalRunInstance
		},
		closeHostCapabilities: () => {},
		setInputAttachmentReadAllowed: () => {},
		runWithHostScope: (run) => run()
	};
	const pluginParams = withoutPluginHarnessPrivateState(params);
	const host = createAgentHarnessHostCapabilities({
		attempt: params,
		requiredNodeCommands: harness.cloudPlacement?.devicePlacement?.requiredNodeCommands,
		nativeModelPolicySupport: harness.nativeModelPolicySupport,
		pluginId: ownerPluginId ?? (() => {
			throw new Error(`Agent harness ${harness.id} has no authoritative registry owner.`);
		})()
	});
	return {
		params: {
			...pluginParams,
			hostCapabilities: host.capabilities
		},
		closeHostCapabilities: host.close,
		setInputAttachmentReadAllowed: host.setInputAttachmentReadAllowed,
		runWithHostScope: host.runWithScope
	};
}
function prepareHarnessFinalizationParams(params, builtIn) {
	const { hostCapabilities: _hostCapabilities, systemAgentTool: _systemAgentTool, ...withoutCapabilities } = params;
	if (builtIn) return withoutCapabilities;
	const pluginParams = withoutPluginHarnessPrivateState(withoutCapabilities);
	const boundary = "plugin harness finalization handoff";
	return {
		...pluginParams,
		model: unwrapModelHeaderSentinelsForProviderEgress(pluginParams.model, boundary),
		resolvedApiKey: pluginParams.resolvedApiKey ? unwrapSecretSentinelsForProviderEgress(pluginParams.resolvedApiKey, boundary) : pluginParams.resolvedApiKey
	};
}
async function preparePluginHarnessParams(params, harness, nativePermissionsConsented, setInputAttachmentReadAllowed, hasRuntimePluginToolGrant) {
	const boundary = "plugin harness handoff";
	const resolvedApiKey = params.resolvedApiKey ? unwrapSecretSentinelsForProviderEgress(params.resolvedApiKey, boundary) : params.resolvedApiKey;
	const model = unwrapModelHeaderSentinelsForProviderEgress(params.model, boundary);
	const preparedParams = model === params.model && resolvedApiKey === params.resolvedApiKey ? params : {
		...params,
		model,
		resolvedApiKey
	};
	const policies = await preparePluginHarnessToolPolicies(preparedParams, harness.conversationToolPolicySupport === "exact" ? harness.conversationToolPolicySafeDenyTools : void 0, harness.conversationToolPolicyNativeTools);
	if (policies.requiresLiveToolAuthority) assertPluginHarnessConversationToolPolicySupport(harness, true);
	const policyParams = {
		...preparedParams,
		pluginHarnessToolPolicySafeDeniedTools: policies.safeDeniedToolNames.length > 0 ? policies.safeDeniedToolNames : void 0,
		pluginHarnessToolPolicyRestricted: policies.toolPolicyRestricted,
		pluginHarnessToolPolicyScope: hasRuntimePluginToolGrant ? "turn" : policies.toolPolicyScope
	};
	const effectiveParams = nativePermissionsConsented ? {
		...policyParams,
		permissionMode: "full"
	} : applyPluginHarnessDenyAllToolPolicy(policyParams, policies);
	setInputAttachmentReadAllowed(isRuntimeToolAllowed("read", effectiveParams.toolsAllow) && isRuntimeToolAllowed("read", effectiveParams.toolExecutionAllow) && isToolAllowedByPolicies("read", [
		policies.senderPolicy,
		policies.groupPolicy,
		...policies.runtimePolicies
	]));
	return effectiveParams;
}
function applyPluginHarnessDenyAllToolPolicy(params, policies) {
	if (isHostScopedAgentToolActive("openclaw") && isSystemAgentOnlyAllowlist(params.toolsAllow)) return params;
	const prompt = resolvePluginHarnessDenyAllToolPolicyPrompt(policies);
	if (!prompt) return params;
	return {
		...params,
		toolsAllow: [],
		extraSystemPrompt: appendPluginHarnessToolPolicyPrompt(params.extraSystemPrompt, prompt)
	};
}
function appendPluginHarnessToolPolicyPrompt(existing, prompt) {
	const trimmed = existing?.trim();
	if (!trimmed) return prompt;
	return trimmed.includes(prompt) ? trimmed : `${trimmed}\n\n${prompt}`;
}
function logAgentHarnessSelection(selection, params) {
	if (!log.isEnabled("debug")) return;
	log.debug("agent harness selected", {
		provider: params.provider,
		modelId: params.modelId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		selectedHarnessId: selection.selectedHarnessId,
		selectedReason: selection.selectedReason,
		runtime: selection.policy.runtime,
		candidates: selection.candidates
	});
}
//#endregion
export { selectAgentHarnessForPreparedModelProviders as i, runAgentHarnessSettledTurnFinalization as n, selectAgentHarness as r, runAgentHarnessAttempt as t };
