import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { O as freezeDiagnosticTraceContext, P as runWithDiagnosticTraceContext, T as createDiagnosticTraceContext, c as emitTrustedDiagnosticEventWithPrivateData, k as getActiveDiagnosticTraceContext, s as emitTrustedDiagnosticEvent, w as createChildDiagnosticTraceContext } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { v as resolveSessionAgentIds } from "./agent-scope-CG17uXFn.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import { a as isRuntimeToolAllowed, o as isToolAllowedByPolicies } from "./tool-policy-match-Dn8gpf-E.mjs";
import "./tool-policy-BKvvmcQR.mjs";
import { h as resolveAdmittedRunActiveAssertion, m as readRunOperatorAuthority, n as assertOperatorModelAllowed, r as bindOperatorModelExecution } from "./admitted-run-context-QJnFIxUZ.mjs";
import { i as unwrapSecretSentinelsForProviderEgress, r as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-LltAZ95s.mjs";
import { o as resolveAgentHarnessPreparedAuthSupport, r as assertPluginHarnessConversationToolPolicySupport, s as resolveAgentHarnessPreparedRouteSupport } from "./availability-DXC5lyRk.mjs";
import { o as recordAgentHarnessPreflightOwner, t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-BSgZdc_o.mjs";
import { r as assertContextEngineHostSupport } from "./host-compat-xESS3bi6.mjs";
import { r as resolveAgentHarnessSelectionDecision, t as buildAgentHarnessSelectionDecision } from "./selection-decision-w89fCXgB.mjs";
import { c as normalizeAgentRunAttemptTerminal, l as projectAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { i as resolvePluginHarnessDenyAllToolPolicyPrompt, o as resolvePluginHarnessToolPolicies, t as assertAgentHarnessExecutionEnvironment } from "./execution-environment-D8ss-KeK.mjs";
import { a as prepareActiveNodeContext } from "./active-node-context-DpQMef3G.mjs";
import { t as createAgentHarnessHostCapabilities } from "./host-capability-BD2hyeuI.mjs";
import { i as runWithAgentRingZeroTools, n as isHostScopedAgentToolActive } from "./agent-tools.ring-zero-context-DcmTQndF.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-HvSedbJl.mjs";
import { t as copyCoreTtsAttemptResultProvenance } from "./tts-tool-result-provenance-CHcSX7Wg.mjs";
import { t as claimHeartbeatContextForUserRun } from "./heartbeat-outcome-store-CRJePlvi.mjs";
import { t as appendCurrentInboundContext } from "./runtime-context-prompt-CKrto4c6.mjs";
import { n as isBuiltInOpenClawAgentHarness, t as createOpenClawAgentHarness } from "./builtin-openclaw-DPSlekTi.mjs";
import { i as EmptySettledTurnFinalizationError, t as assertSettledTurnFinalizationResult } from "./settled-turn-finalization-result-BC1GuVZk.mjs";
import { a as selectContextEngineForTranscriptHost, n as drainPendingContextEngineTurnsBeforeRun } from "./context-engine-turn-attempt-B-YEtKIs.mjs";
import { t as subscribeAgentCommentaryDiagnostics } from "./commentary-diagnostics-CWCelAVf.mjs";
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
function agentHarnessRunOutcome(result) {
	const terminal = projectAgentRunAttemptTerminal(result.terminal);
	if (terminal.timedOut) return "timed_out";
	if (terminal.externalAbort || terminal.aborted) return "aborted";
	if (terminal.promptErrorSource !== null) return "error";
	return "completed";
}
function shouldEmitAgentRunDiagnostics(harness) {
	return harness.id !== "openclaw";
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
function emitAgentHarnessRunStarted(harness, params, trace) {
	emitTrustedDiagnosticEvent({
		type: "harness.run.started",
		...agentHarnessDiagnosticBase(harness, params, trace)
	});
}
function emitAgentHarnessRunCompleted(params) {
	const { harness, attemptParams, result, startedAt, trace } = params;
	const outcome = agentHarnessRunOutcome(result);
	const terminal = projectAgentRunAttemptTerminal(result.terminal);
	const errorMessage = outcome === "error" ? diagnosticErrorMessage(terminal.promptError) : void 0;
	emitTrustedDiagnosticEventWithPrivateData({
		type: "harness.run.completed",
		...agentHarnessDiagnosticBase(harness, attemptParams, trace ?? result.diagnosticTrace),
		durationMs: Date.now() - startedAt,
		outcome,
		...result.agentHarnessResultClassification ? { resultClassification: result.agentHarnessResultClassification } : {},
		...typeof result.yieldDetected === "boolean" ? { yieldDetected: result.yieldDetected } : {},
		itemLifecycle: { ...result.itemLifecycle }
	}, errorMessage ? { errorMessage } : void 0);
}
function emitAgentHarnessRunError(params) {
	const { harness, attemptParams, startedAt, phase, error, trace } = params;
	const errorMessage = diagnosticErrorMessage(error);
	emitTrustedDiagnosticEventWithPrivateData({
		type: "harness.run.error",
		...agentHarnessDiagnosticBase(harness, attemptParams, trace),
		durationMs: Date.now() - startedAt,
		phase,
		errorCategory: diagnosticErrorCategory(error)
	}, errorMessage ? { errorMessage } : void 0);
}
/** Runs one harness attempt with diagnostics, tracing, and result classification. */
async function runAgentHarnessLifecycleAttempt(harness, params, execute = (attemptParams) => harness.runAttempt(attemptParams)) {
	let result;
	let phase = "prepare";
	const startedAt = Date.now();
	const activeHarnessTrace = getActiveDiagnosticTraceContext();
	let agentRunTrace;
	let agentRunStartedAt = 0;
	let agentRunCompleted = false;
	const emitAgentRunCompleted = (completion) => {
		if (!agentRunTrace || agentRunCompleted) return;
		agentRunCompleted = true;
		const failed = completion.outcome === "error" && completion.error != null;
		const errorMessage = failed ? diagnosticErrorMessage(completion.error) : void 0;
		emitTrustedDiagnosticEventWithPrivateData({
			type: "run.completed",
			...agentRunDiagnosticBase(params, agentRunTrace),
			durationMs: Date.now() - agentRunStartedAt,
			outcome: completion.outcome,
			...completion.blockedBy ? { blockedBy: completion.blockedBy } : {},
			...failed ? { errorCategory: diagnosticErrorCategory(completion.error) } : {}
		}, errorMessage ? { errorMessage } : void 0);
	};
	emitAgentHarnessRunStarted(harness, params, activeHarnessTrace);
	const unsubscribeCommentary = subscribeAgentCommentaryDiagnostics(params.config, agentHarnessDiagnosticBase(harness, params, activeHarnessTrace));
	try {
		phase = "prepare";
		assertAgentHarnessContextEngineSupport(harness, params);
		if (shouldEmitAgentRunDiagnostics(harness) && activeHarnessTrace) {
			agentRunTrace = freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(activeHarnessTrace));
			agentRunStartedAt = Date.now();
			emitTrustedDiagnosticEvent({
				type: "run.started",
				...agentRunDiagnosticBase(params, agentRunTrace)
			});
		}
		const runAndClassify = async () => {
			phase = "send";
			const rawResult = await execute(params);
			phase = "resolve";
			return copyCoreTtsAttemptResultProvenance(rawResult, normalizeAgentHarnessAttemptResult(applyAgentHarnessResultClassification(harness, rawResult, params)));
		};
		result = agentRunTrace ? await runWithDiagnosticTraceContext(agentRunTrace, runAndClassify) : await runAndClassify();
		result = withFallbackDiagnosticTrace(result, activeHarnessTrace);
	} catch (error) {
		recordAgentHarnessPreflightOwner(error, harness.id);
		emitAgentHarnessRunError({
			harness,
			attemptParams: params,
			startedAt,
			phase,
			error,
			trace: activeHarnessTrace
		});
		emitAgentRunCompleted({
			outcome: "error",
			error
		});
		throw error;
	} finally {
		unsubscribeCommentary();
	}
	emitAgentRunCompleted(agentRunCompletion(result));
	emitAgentHarnessRunCompleted({
		harness,
		attemptParams: params,
		result,
		startedAt,
		trace: activeHarnessTrace
	});
	return result;
}
/** Runs one isolated finalization with diagnostics and its narrow result validator. */
async function runAgentHarnessLifecycleFinalization(harness, params, execute) {
	let phase = "prepare";
	const startedAt = Date.now();
	const activeHarnessTrace = getActiveDiagnosticTraceContext();
	const agentRunTrace = shouldEmitAgentRunDiagnostics(harness) && activeHarnessTrace ? freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(activeHarnessTrace)) : void 0;
	emitAgentHarnessRunStarted(harness, params, activeHarnessTrace);
	const unsubscribeCommentary = subscribeAgentCommentaryDiagnostics(params.config, agentHarnessDiagnosticBase(harness, params, activeHarnessTrace));
	if (agentRunTrace) emitTrustedDiagnosticEvent({
		type: "run.started",
		...agentRunDiagnosticBase(params, agentRunTrace)
	});
	try {
		const runAndValidate = async () => {
			phase = "send";
			try {
				const rawResult = await execute();
				phase = "resolve";
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
		const rawResult = agentRunTrace ? await runWithDiagnosticTraceContext(agentRunTrace, runAndValidate) : await runAndValidate();
		const result = {
			...rawResult,
			result: rawResult.result.diagnosticTrace || !activeHarnessTrace ? rawResult.result : {
				...rawResult.result,
				diagnosticTrace: freezeDiagnosticTraceContext(activeHarnessTrace)
			}
		};
		if (agentRunTrace) emitTrustedDiagnosticEvent({
			type: "run.completed",
			...agentRunDiagnosticBase(params, agentRunTrace),
			durationMs: Date.now() - startedAt,
			outcome: "completed"
		});
		emitTrustedDiagnosticEvent({
			type: "harness.run.completed",
			...agentHarnessDiagnosticBase(harness, params, result.result.diagnosticTrace ?? activeHarnessTrace),
			durationMs: Date.now() - startedAt,
			outcome: "completed",
			itemLifecycle: {
				startedCount: 0,
				completedCount: 0,
				activeCount: 0
			}
		});
		return result;
	} catch (error) {
		emitAgentHarnessRunError({
			harness,
			attemptParams: params,
			startedAt,
			phase,
			error,
			trace: activeHarnessTrace
		});
		if (agentRunTrace) {
			const errorMessage = diagnosticErrorMessage(error);
			emitTrustedDiagnosticEventWithPrivateData({
				type: "run.completed",
				...agentRunDiagnosticBase(params, agentRunTrace),
				durationMs: Date.now() - startedAt,
				outcome: "error",
				errorCategory: diagnosticErrorCategory(error)
			}, errorMessage ? { errorMessage } : void 0);
		}
		throw error;
	} finally {
		unsubscribeCommentary();
	}
}
//#endregion
//#region src/agents/harness/selection.ts
/**
* Selects and invokes native agent harnesses for embedded run attempts.
*/
const log = createSubsystemLogger("agents/harness");
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
	assertAgentHarnessExecutionEnvironment(harness, params);
	if (nativeSessionRuntime && harness !== nativeSessionRuntime.harness) throw new AgentHarnessPreflightError("Native session runtime changed before dispatch. Reattach the original native session before retrying.");
	if (internalParams.contextEngineLogicalTurnLease) {
		selectContextEngineForTranscriptHost({
			lease: internalParams.contextEngineLogicalTurnLease,
			host: {
				id: `agent-harness:${harness.id}`,
				label: `agent harness "${harness.id}"`,
				capabilities: harness.contextEngineHostCapabilities ?? []
			},
			operation: "agent-run",
			recorder: internalParams.userTurnTranscriptRecorder
		});
		await drainPendingContextEngineTurnsBeforeRun({
			admission: internalParams.userTurnTranscriptRecorder?.getAdmissionReceipt(),
			isHeartbeat: isHeartbeatLifecycleRunKind(internalParams.bootstrapContextRunKind),
			lease: internalParams.contextEngineLogicalTurnLease,
			recorder: internalParams.userTurnTranscriptRecorder,
			sessionTarget: internalParams.sessionTarget
		});
		const effective = internalParams.contextEngineLogicalTurnLease.begin();
		internalParams = {
			...internalParams,
			contextEngine: effective.engine.info.id === "legacy" ? void 0 : effective.engine
		};
	}
	if (internalParams.systemAgentTool && !isSystemAgentOnlyAllowlist(internalParams.toolsAllow)) throw new Error("OpenClaw host authority requires toolsAllow: [\"openclaw\"]");
	const ringZeroTools = internalParams.systemAgentTool ? [(await import("./system-agent-tool-YHsFmXy8.mjs")).createSystemAgentTool(internalParams.systemAgentTool)] : [];
	if (!selection.builtIn && !internalParams.suppressNextUserMessagePersistence && internalParams.userTurnTranscriptRecorder) {
		const assertCurrent = resolveAdmittedRunActiveAssertion(internalParams.admittedRunContext, internalParams.abortSignal);
		if (!assertCurrent) throw new Error("agent harness requires active admitted run authority");
		assertCurrent();
		await internalParams.userTurnTranscriptRecorder.persistApproved({ cwd: internalParams.cwd ?? internalParams.workspaceDir });
		assertCurrent();
	}
	if (nativeSessionRuntime) await nativeSessionRuntime.assertCurrent();
	const pluginAttempt = withoutInternalHarnessAuthority(withoutHarnessSetupAuthority(internalParams), harness, selection.builtIn, selection.ownerPluginId);
	logAgentHarnessSelection(selection, {
		provider: params.provider,
		modelId: params.modelId,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	let result;
	try {
		result = await runAgentHarnessOperation(harness, params, () => runWithAgentRingZeroTools(ringZeroTools, () => {
			const hostOpenClawAuthority = isHostScopedAgentToolActive("openclaw") && isSystemAgentOnlyAllowlist(pluginAttempt.params.toolsAllow);
			const nativePermissionsConsented = assertAgentHarnessExecutionEnvironment(harness, params);
			const preparedParams = selection.builtIn ? pluginAttempt.params : preparePluginHarnessParams(pluginAttempt.params, harness, nativePermissionsConsented, pluginAttempt.setInputAttachmentReadAllowed);
			const effectiveAttemptParams = hostOpenClawAuthority && preparedParams.pluginHarnessToolPolicyRestricted ? {
				...preparedParams,
				pluginHarnessToolPolicyRestricted: false
			} : preparedParams;
			assertPluginHarnessConversationToolPolicySupport(harness, effectiveAttemptParams.pluginHarnessToolPolicyRestricted === true && !nativePermissionsConsented);
			return import("./tool-authority.runtime.js").then(({ withPreparedEmbeddedRunToolAuthority }) => withPreparedEmbeddedRunToolAuthority(internalParams, effectiveAttemptParams, selection.builtIn ? void 0 : (input) => {
				const policies = resolvePluginHarnessToolPolicies({
					...input.run,
					modelId: input.run.model,
					sandboxSessionKey: input.run.runtimePolicySessionKey,
					messageChannel: input.originatingChannel,
					toolsAllow: input.toolsAllow,
					disableTools: input.disableTools
				});
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
	if (isBuiltInOpenClawAgentHarness(harness)) return await runWithDiagnosticTraceContext(harnessTrace, execute);
	try {
		return await runWithDiagnosticTraceContext(harnessTrace, execute);
	} catch (error) {
		log.warn(`${harness.label} failed; not falling back to embedded OpenClaw backend`, {
			harnessId: harness.id,
			provider: params.provider,
			modelId: params.modelId,
			error: formatErrorMessage(error)
		});
		throw error;
	}
}
function isSystemAgentOnlyAllowlist(toolsAllow) {
	return toolsAllow?.length === 1 && normalizeToolPolicyName(toolsAllow[0] ?? "") === "openclaw";
}
function withoutHarnessSetupAuthority(params) {
	const { contextEngineLogicalTurnLease: _contextEngineLogicalTurnLease, systemAgentTool: _systemAgentTool, ...attemptParams } = params;
	return attemptParams;
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
function withoutPluginHarnessPrivateState(params) {
	const { admittedRunContext: _admittedRunContext, runtimePluginToolGrant: _runtimePluginToolGrant, assistantErrorTranscript: _assistantErrorTranscript, compactionCountOwner: _compactionCountOwner, completionCheck: _completionCheck, onContextAccountingEvent: _onContextAccountingEvent, onCompactionRequestBudget: _onCompactionRequestBudget, contextEngineLogicalTurnLease: _contextEngineLogicalTurnLease, hostCapabilities: _hostCapabilities, onContextEngineTurnCandidate: _onContextEngineTurnCandidate, trajectoryRecorder: _trajectoryRecorder, inputAttachmentMedia: _inputAttachmentMedia, supportsTurnScopedToolRestrictions: _supportsTurnScopedToolRestrictions, __openclawSourceReplyDeliveryRuntime: _sourceReplyDeliveryRuntime, ...pluginParams } = params;
	return pluginParams;
}
function preparePluginHarnessParams(params, harness, nativePermissionsConsented, setInputAttachmentReadAllowed) {
	const boundary = "plugin harness handoff";
	const resolvedApiKey = params.resolvedApiKey ? unwrapSecretSentinelsForProviderEgress(params.resolvedApiKey, boundary) : params.resolvedApiKey;
	const model = unwrapModelHeaderSentinelsForProviderEgress(params.model, boundary);
	const preparedParams = model === params.model && resolvedApiKey === params.resolvedApiKey ? params : {
		...params,
		model,
		resolvedApiKey
	};
	const policies = resolvePluginHarnessToolPolicies(preparedParams, harness.conversationToolPolicySupport === "exact" ? harness.conversationToolPolicySafeDenyTools : void 0, harness.conversationToolPolicyNativeTools);
	const policyParams = {
		...preparedParams,
		pluginHarnessToolPolicySafeDeniedTools: policies.safeDeniedToolNames.length > 0 ? policies.safeDeniedToolNames : void 0,
		pluginHarnessToolPolicyRestricted: policies.toolPolicyRestricted
	};
	const effectiveParams = nativePermissionsConsented ? policyParams : applyPluginHarnessDenyAllToolPolicy(policyParams, policies);
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
