import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import { a as getGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { i as getPluginRuntimeGatewayRequestScope, s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { C as createChildDiagnosticTraceContext, D as freezeDiagnosticTraceContext, N as runWithDiagnosticTraceContext, O as getActiveDiagnosticTraceContext, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, w as createDiagnosticTraceContext } from "./diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { y as resolveSessionAgentIds } from "./agent-scope-CTuYDtny.mjs";
import { a as withInstallationTarget, n as getInstallationTarget, r as installationTargetEnv } from "./installation-target-context-CrBRhZSM.mjs";
import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-DO6Dg2r0.mjs";
import { c as emitAgentRunOutputTokens, h as registerAgentEventLifecycleRotationHandler } from "./agent-events-BOSJcayE.mjs";
import { i as capturePluginLifecycleAuthority } from "./registry-lifecycle-BhTDZAHB.mjs";
import { l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { l as rewrapToolWithBeforeToolCallHook, x as runBeforeToolCallHook } from "./agent-tools.before-tool-call-C2rI0w1x.mjs";
import { s as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-MlBhwaKa.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-CtZtwiOt.mjs";
import { i as unwrapSecretSentinelsForProviderEgress, r as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-BkXZF4dA.mjs";
import { c as resolveAgentHarnessPreparedRouteSupport, r as assertPluginHarnessConversationToolPolicySupport, s as resolveAgentHarnessPreparedAuthSupport } from "./availability-CUZDnZeh.mjs";
import { o as recordAgentHarnessPreflightOwner, t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { f as sessionTranscriptIndexNeedsReconcile } from "./session-transcript-index-UaRlRUAw.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { c as getUserTurnTranscriptAdmissionOwner } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-B0dOIy5w.mjs";
import { t as redactTranscriptMessage } from "./transcript-redact-CcOcbRyc.mjs";
import { l as loadSessionEntryReadOnly, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { g as publishTranscriptUpdate } from "./session-accessor.sqlite-lifecycle-state-DdmXgBkg.mjs";
import { D as rewriteTranscriptMessageAtAnchor, h as sessionMatchesExpectedTranscriptTurn } from "./session-accessor-l-4ZHvKn.mjs";
import { n as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import { f as resolveAdmittedRunActiveAssertion, m as retainAdmittedRunBeforeToolCallRecovery, o as getAdmittedRunDelegatedAuthority, u as readAdmittedRunOperatorAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { c as normalizeAgentRunAttemptTerminal, l as projectAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { g as throwAgentRunRestartAbortReason } from "./run-termination-Cd1iJzC7.mjs";
import { r as copyAgentToolMetadata } from "./agent-tool-metadata-COcr-3AD.mjs";
import { n as createCronScheduledToolProjection } from "./exec-tool-target-pinning-s_GhmaTA.mjs";
import { a as attachInternalToolExecutionPreparer, p as getInternalToolExecutionPreparer } from "./internal-hooks-DUPhyX-W.mjs";
import { a as withGatewayToolApprovalOwner, c as wrapToolWithGatewayCallerIdentity, i as getGatewayToolCallerIdentity, n as createAdmittedGatewayToolCallerIdentity, o as withGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { i as withChannelReadAuthority } from "./channel-read-authority-CLJnqxr1.mjs";
import { r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-DSynPRwg.mjs";
import { c as registerTrustedToolNoStartError } from "./tool-result-error-CWadvCKd.mjs";
import { t as callGatewayTool } from "./gateway-fiwofDIl.mjs";
import { t as bindAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-CEFulHpI.mjs";
import { a as registerAgentHarnessScheduledToolProjectionCapability, d as withAgentQuestionAnswerAuthority, l as resolveAgentQuestionAnswerAuthority, o as registerAgentHarnessTtsProvenanceTransferCapability, r as registerAgentHarnessBeforeToolCallRetention } from "./host-private-capabilities-D8EEgJHq.mjs";
import { r as assertContextEngineHostSupport } from "./host-compat-xESS3bi6.mjs";
import { r as resolveAgentHarnessSelectionDecision, t as buildAgentHarnessSelectionDecision } from "./selection-decision-l7qEyIJb.mjs";
import { i as resolvePluginHarnessDenyAllToolPolicyPrompt, o as resolvePluginHarnessToolPolicies, t as assertAgentHarnessExecutionEnvironment } from "./execution-environment-D3NQqOzj.mjs";
import { i as prepareActiveNodeContext, t as buildActiveNodeContextText } from "./active-node-context-Chc0tKJ6.mjs";
import { t as claimHeartbeatContextForUserRun } from "./heartbeat-outcome-store-Do2Z0dgV.mjs";
import { i as runWithAgentRingZeroTools, n as isHostScopedAgentToolActive } from "./agent-tools.ring-zero-context-DcmTQndF.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-HvSedbJl.mjs";
import { t as appendCurrentInboundContext } from "./runtime-context-prompt-Jr1ZDwll.mjs";
import { o as transferCoreTtsToolResultProvenance, r as getCoreTtsToolResultMediaUrls, t as copyCoreTtsAttemptResultProvenance } from "./tts-tool-result-provenance-z42MPFVT.mjs";
import { n as isBuiltInOpenClawAgentHarness, t as createOpenClawAgentHarness, ut as runBestEffortCallback } from "./builtin-openclaw-CzzhJmXX.mjs";
import { t as log$1 } from "./logger-Cp6WXSpQ.mjs";
import { t as resolveSkillResourceCandidates } from "./resource-candidates-jROPV5-K.mjs";
import { i as EmptySettledTurnFinalizationError, t as assertSettledTurnFinalizationResult } from "./settled-turn-finalization-result-DlRV2dc9.mjs";
import { n as wrapToolWithAbortSignal } from "./agent-tools.abort-g8BtZl1O.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-C33rGaR3.mjs";
import { n as createOpenClawCodingToolsInternal } from "./agent-tools-Bs9qKBwn.mjs";
import { l as prepareGitHubToolEnvironment } from "./github-tool-identity-BOF32-1s.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-CHx7Z_89.mjs";
import { a as selectContextEngineForTranscriptHost, n as drainPendingContextEngineTurnsBeforeRun } from "./context-engine-turn-attempt-D2xPfEYf.mjs";
import { t as registerMcpToolApprovalBinding } from "./mcp-tool-approval-binding-z65X_L_Y.mjs";
import { s as prepareSystemRunMutableFileApproval } from "./system-run-approval-binding-BDEolZhR.mjs";
import { t as formatHarnessApprovalPresentation } from "./native-hook-relay-approval-presentation-DMLDwkX3.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
//#region src/sessions/user-turn-transcript-annotation.ts
/** Core-only binding performed by the harness host before invoking plugin code. */
function bindUserTurnTranscriptAnnotation(params) {
	const owner = getUserTurnTranscriptAdmissionOwner(params.recorder);
	const receipt = owner?.receipt();
	const message = owner?.message();
	if (!owner || !receipt || !message || owner.blocked() || message.excludeFromContext === true) return;
	let admission = structuredClone(receipt);
	let admittedMessage = structuredClone(message);
	const target = { ...params.target };
	const selected = loadSessionEntry({
		...target,
		readConsistency: "latest"
	});
	const fence = getOwnedSessionTranscriptWriterFence({ sessionTarget: target });
	if (target.sessionId !== admission.sessionId || target.sessionKey !== admission.sessionKey || target.agentId !== admission.agentId || resolveSessionTranscriptDatabasePath(target) !== admission.storePath || !selected || selected.sessionId !== admission.sessionId || selected.activeWriterRunId !== void 0 && selected.activeWriterRunId !== params.runId) return;
	const expectedLifecycleRevision = target.expectedLifecycleRevision ?? fence?.expectedLifecycleRevision ?? selected.lifecycleRevision ?? null;
	const expectedWriterRunId = target.expectedWriterRunId ?? fence?.expectedWriterRunId;
	const assertCurrent = () => {
		params.assertCurrent();
		const current = loadSessionEntry({
			...target,
			readConsistency: "latest"
		});
		const { logicalTurnId: _logicalTurnId, role: _role, ...anchor } = admission;
		if (params.abortSignal?.aborted || owner.blocked() || !isDeepStrictEqual(owner.receipt(), admission) || !isDeepStrictEqual(owner.message(), admittedMessage) || admittedMessage["__openclaw"]?.steerTargetRunId !== void 0 || !sessionMatchesExpectedTranscriptTurn(current ? { entry: current } : void 0, {
			expectedSessionId: admission.sessionId,
			expectedLifecycleRevision,
			expectedWriterRunId
		}) || fence?.expectedWriterRunId !== void 0 && current?.activeWriterRunId !== fence.expectedWriterRunId || fence?.expectedLifecycleRevision !== void 0 && current?.lifecycleRevision !== fence.expectedLifecycleRevision || current?.activeWriterRunId !== selected.activeWriterRunId || sessionTranscriptIndexNeedsReconcile(openOpenClawAgentDatabase({
			agentId: admission.agentId,
			path: admission.storePath
		}).db, admission.sessionId) || !isDeepStrictEqual(readActiveTranscriptEntryAnchor(admission), anchor)) throw new Error("current user admission is no longer available for native annotation");
	};
	return async (annotation) => {
		const fields = {
			mirrorIdentity: annotation.mirrorIdentity,
			upstreamUserText: annotation.upstreamUserText,
			mirrorOrigin: annotation.mirrorOrigin,
			mirrorSourceFingerprint: annotation.mirrorSourceFingerprint,
			runId: params.runId
		};
		if (Object.values(fields).some((value) => typeof value !== "string") || !fields.mirrorIdentity || !fields.mirrorOrigin || !fields.mirrorSourceFingerprint) throw new Error("native prompt annotation requires complete provenance");
		assertCurrent();
		if (sha256HexPrefixCore(JSON.stringify({
			role: "user",
			content: admittedMessage.content,
			upstreamUserText: fields.upstreamUserText || void 0
		}), 32) !== fields.mirrorSourceFingerprint) throw new Error("native prompt annotation does not match admitted content");
		let verified = false;
		const rewritten = await rewriteTranscriptMessageAtAnchor(admission, (current) => {
			assertCurrent();
			if (!isDeepStrictEqual(current, admittedMessage)) throw new Error("native prompt annotation cannot replace an edited admission");
			const metadata = admittedMessage["__openclaw"] ?? {};
			if (metadata.runTerminal !== void 0 || Object.entries(fields).some(([key, value]) => metadata[key] !== void 0 && metadata[key] !== value)) throw new Error("native prompt annotation conflicts with recorded provenance");
			const next = {
				...admittedMessage,
				__openclaw: {
					...metadata,
					...fields
				}
			};
			if (!isDeepStrictEqual(redactTranscriptMessage(next, params.config), next)) throw new Error("native prompt annotation would restore redacted evidence");
			verified = true;
			return isDeepStrictEqual(next, admittedMessage) ? void 0 : next;
		});
		if (!verified) throw new Error("native prompt admission disappeared before annotation");
		if (rewritten) {
			admission = {
				...admission,
				generation: rewritten.generation
			};
			admittedMessage = structuredClone(rewritten.message);
			owner.refresh({ ...admission }, rewritten.message);
			await waitForSessionTranscriptProjection(admission, params.abortSignal);
		}
		assertCurrent();
		if (rewritten) {
			await publishTranscriptUpdate(admission, {
				message: rewritten.message,
				messageId: admission.entryId,
				messageSeq: admission.activeMessagePosition + 1
			});
			assertCurrent();
		}
	};
}
//#endregion
//#region src/agents/harness/context-media.ts
/** Captures media policy before plugin invocation while keeping extraction dependencies lazy. */
function bindHarnessContextMedia(params) {
	const { attempt, config, assertActive } = params;
	if (!attempt.workspaceDir || !attempt.model) return;
	const modelInput = structuredClone(attempt.model.input);
	Object.freeze(modelInput);
	const contextMedia = Object.freeze({
		config,
		workspaceDir: attempt.sandbox?.enabled ? attempt.sandbox.workspaceDir : attempt.workspaceDir,
		agentWorkspaceDir: attempt.workspaceDir,
		modelInput,
		agentId: attempt.agentId,
		channelId: attempt.messageChannel ?? attempt.messageProvider,
		accountId: attempt.agentAccountId,
		...attempt.sandbox?.enabled && attempt.sandbox.fsBridge ? { sandbox: Object.freeze({
			root: attempt.sandbox.workspaceDir,
			bridge: attempt.sandbox.fsBridge
		}) } : {}
	});
	const assertCurrent = () => {
		assertActive();
		attempt.abortSignal?.throwIfAborted();
	};
	return async (request) => {
		assertCurrent();
		const { prepareHarnessContextMedia } = await import("./context-media-runtime-U1fa2cwd.mjs");
		assertCurrent();
		const result = await prepareHarnessContextMedia({
			...request,
			...contextMedia,
			assertCurrent
		});
		assertCurrent();
		return result;
	};
}
//#endregion
//#region src/agents/harness/host-source-authority.ts
const retainedSources = resolveGlobalSingleton(Symbol.for("openclaw.harness.retainedSources"), () => /* @__PURE__ */ new Set());
registerAgentEventLifecycleRotationHandler("harness-retained-sources", () => {
	const retiring = [...retainedSources];
	retainedSources.clear();
	for (const controller of retiring) controller.abort(/* @__PURE__ */ new Error("agent harness retained source is no longer active"));
});
/** Transfers original-source custody while the issuing foreground host is still live. */
function retainHarnessSource(admittedRunContext, assertActive) {
	assertActive();
	const lifecycleGeneration = getAgentRunLifecycleGeneration();
	const source = readAdmittedRunOperatorAuthority(admittedRunContext);
	if (!source) return;
	const release = source.retain?.();
	try {
		assertActive();
		source.assertCurrent();
		assertActive();
	} catch (error) {
		release?.();
		throw error;
	}
	let released = false;
	const lifecycle = new AbortController();
	retainedSources.add(lifecycle);
	const signal = source.signal ? AbortSignal.any([source.signal, lifecycle.signal]) : lifecycle.signal;
	const assertRetained = () => {
		if (released || getAgentRunLifecycleGeneration() !== lifecycleGeneration) throw new Error("agent harness retained source is no longer active");
		signal.throwIfAborted();
	};
	return Object.freeze({
		signal,
		assertCurrent: () => {
			assertRetained();
			source.assertCurrent();
			assertRetained();
		},
		release: () => {
			if (!released) {
				released = true;
				retainedSources.delete(lifecycle);
				release?.();
			}
		}
	});
}
//#endregion
//#region src/agents/harness/node-execution-authority.ts
/** Full is admitted host authority, narrowed to one placement claim, never a request flag. */
function createSessionNodeAuthorities(attempt, pluginId, requiredNodeCommands, assertActive, signal) {
	const admittedFull = attempt.permissionMode === "full";
	const resolveContext = getGatewayContextResolver(attempt.admittedRunContext);
	const context = resolveContext?.();
	const target = attempt.sessionTarget;
	const gatewayRegistry = getActivePluginRegistry();
	const pluginOwners = [gatewayRegistry, getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? gatewayRegistry].map((owner) => {
		const record = owner?.plugins.find((candidate) => candidate.id === pluginId);
		return owner && record ? capturePluginLifecycleAuthority(owner, record, { scopedRuntime: owner !== gatewayRegistry }) : void 0;
	});
	const assertPlacementCurrent = getPluginRuntimeGatewayRequestScope()?.assertNodeExecutionCurrent;
	if (!context || !target?.storePath || !attempt.agentId || !attempt.sessionKey || !attempt.sessionId || !assertPlacementCurrent) return {};
	const session = {
		agentId: attempt.agentId,
		sessionKey: attempt.sessionKey,
		storePath: target.storePath
	};
	const assertRequestCurrent = (request) => {
		if (request.source === "session-full" && (!admittedFull || !requiredNodeCommands.has(request.command))) throw new Error("admitted node execution authority does not cover this command");
		assertActive();
		const entry = loadSessionEntryReadOnly(session);
		if (signal.aborted || getActivePluginRegistry() !== gatewayRegistry || pluginOwners.some((isCurrent) => !isCurrent?.()) || request.source === "session-full" && (attempt.permissionMode !== "full" || !requiredNodeCommands.has(request.command)) || resolveContext && resolveContext() !== context || request.pluginId !== pluginId || !entry || entry.sessionId !== attempt.sessionId || request.source === "session-full" && entry.permissionMode !== "full" || request.workspace.sessionKey !== attempt.sessionKey || request.workspace.sessionId !== attempt.sessionId) throw new Error("admitted node execution authority is no longer current");
		assertPlacementCurrent({
			...request,
			runId: attempt.runId,
			agentId: session.agentId
		});
	};
	const invokeWithSessionNodeAuthority = async (request, invoke) => {
		if (request.source === "session-full" && (!admittedFull || !requiredNodeCommands.has(request.command))) return;
		const assertCurrent = () => assertRequestCurrent(request);
		assertCurrent();
		const result = await invoke(assertCurrent, signal);
		assertCurrent();
		return result;
	};
	return {
		invokeWithSessionNodeAuthority,
		nodePlacementGrantAuthority: {
			agentId: session.agentId,
			sessionKey: attempt.sessionKey,
			runId: attempt.runId,
			assertCurrent: (request) => assertRequestCurrent({
				...request,
				source: "human-approved"
			})
		}
	};
}
//#endregion
//#region src/agents/harness/reply-media.ts
/** Capture policy before plugin invocation; the supplied reader only provides workspace bytes. */
function bindHarnessReplyMedia(params) {
	const { attempt, assertActive } = params;
	if (!attempt.workspaceDir) return;
	const context = Object.freeze({
		cfg: params.config ?? {},
		workspaceDir: attempt.workspaceDir,
		agentId: attempt.agentId,
		sessionKey: attempt.sessionKey ?? attempt.sessionId,
		messageProvider: attempt.messageChannel ?? attempt.messageProvider,
		accountId: attempt.agentAccountId,
		groupId: attempt.groupId ?? void 0,
		groupChannel: attempt.groupChannel ?? void 0,
		groupSpace: attempt.groupSpace ?? void 0,
		requesterSenderId: attempt.senderId ?? void 0,
		requesterSenderName: attempt.senderName ?? void 0,
		requesterSenderUsername: attempt.senderUsername ?? void 0,
		requesterSenderE164: attempt.senderE164 ?? void 0,
		sourceReplyDeliveryMode: attempt.sourceReplyDeliveryMode,
		runId: attempt.runId,
		reasoningLevel: attempt.reasoningLevel
	});
	const attemptSignal = attempt.abortSignal;
	return async (request) => {
		const signal = AbortSignal.any([
			params.signal,
			...attemptSignal ? [attemptSignal] : [],
			...request.signal ? [request.signal] : []
		]);
		const assertCurrent = () => {
			assertActive();
			signal.throwIfAborted();
		};
		assertCurrent();
		const { prepareHarnessReplyMedia } = await import("./reply-media-runtime-1W6noWM4.mjs");
		assertCurrent();
		const result = await withChannelReadAuthority(assertCurrent, () => prepareHarnessReplyMedia({
			request,
			context,
			signal,
			assertCurrent
		}), signal);
		assertCurrent();
		return result;
	};
}
//#endregion
//#region src/agents/harness/host-capability.ts
const MAX_NATIVE_OPERATION_CWD_BYTES = 4096;
function normalizeNativeOperationCwd(value, attemptCwd) {
	if (typeof value !== "string") throw new Error("native operation cwd must be a string");
	const normalized = value.trim();
	if (!normalized) throw new Error("native operation cwd must not be empty");
	if (Buffer.byteLength(normalized, "utf8") > MAX_NATIVE_OPERATION_CWD_BYTES) throw new Error(`native operation cwd must not exceed ${MAX_NATIVE_OPERATION_CWD_BYTES} bytes`);
	for (let index = 0; index < normalized.length; index += 1) {
		const code = normalized.charCodeAt(index);
		if (code < 32 || code === 127) throw new Error("native operation cwd must not contain control characters");
	}
	return path.resolve(attemptCwd ?? process.cwd(), normalized);
}
function freezeSnapshot(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object" || seen.has(value)) return value;
	seen.add(value);
	for (const nested of Object.values(value)) freezeSnapshot(nested, seen);
	return Object.freeze(value);
}
function cloneSnapshot(value) {
	return freezeSnapshot(structuredClone(value));
}
function gateBoundTool(tool, assertActive, observeResult) {
	const execute = tool.execute;
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (!execute && !sourcePreparer) return tool;
	const gated = {
		...tool,
		...execute ? { execute: async (...args) => {
			try {
				assertActive();
			} catch (error) {
				throw registerTrustedToolNoStartError(error);
			}
			const result = await execute(...args);
			assertActive();
			observeResult(result);
			return result;
		} } : {}
	};
	copyAgentToolMetadata(tool, gated);
	if (sourcePreparer) attachInternalToolExecutionPreparer(gated, async (preparationParams) => {
		assertActive();
		const prepared = await sourcePreparer(preparationParams);
		try {
			assertActive();
		} catch (error) {
			prepared.dispose();
			throw error;
		}
		if (prepared.kind === "immediate") {
			if (prepared.outcome.kind === "result") observeResult(prepared.outcome.result);
			return prepared;
		}
		return {
			...prepared,
			execute: async (onImplementationStart) => {
				assertActive();
				const result = await prepared.execute(onImplementationStart);
				assertActive();
				observeResult(result);
				return result;
			}
		};
	});
	return gated;
}
/** Creates a closure-bound capability before plugin invocation. */
function createAgentHarnessHostCapabilities(params) {
	const attempt = params.attempt;
	const githubPublicationAvailable = attempt.githubPublicationAvailable;
	const workSignal = getAsyncWorkSignal();
	const attemptSignal = attempt.abortSignal;
	const installationTarget = getInstallationTarget();
	const localProcessEnv = installationTargetEnv(installationTarget);
	const { sessionKey, onAgentEvent } = attempt;
	const requiredNodeCommands = new Set(params.requiredNodeCommands);
	const operationalRunInstance = attempt.admittedRunContext.operationalRunInstance;
	const delegatedAuthority = getAdmittedRunDelegatedAuthority(attempt.admittedRunContext);
	if (!delegatedAuthority) throw new Error("agent harness host capability requires active admitted run authority");
	const { lifecycleGeneration } = delegatedAuthority;
	const { runId } = delegatedAuthority.operationalRunInstance;
	const coreTtsToolResults = /* @__PURE__ */ new WeakSet();
	let active = true;
	const capabilityAbortController = new AbortController();
	const inheritedCaller = getGatewayToolCallerIdentity();
	const sourceCaller = inheritedCaller?.operationalRunInstance === operationalRunInstance ? inheritedCaller : void 0;
	const callerIdentity = createAdmittedGatewayToolCallerIdentity({
		admittedRunContext: attempt.admittedRunContext,
		receiptAuthority: assertActive,
		approvalSignals: [capabilityAbortController.signal, ...attemptSignal ? [attemptSignal] : []],
		agentId: attempt.agentId,
		sessionKey: attempt.sessionKey,
		turnSourceChannel: attempt.messageChannel ?? attempt.messageProvider,
		turnSourceTo: attempt.currentMessagingTarget ?? attempt.currentChannelId,
		turnSourceAccountId: attempt.agentAccountId,
		turnSourceThreadId: attempt.currentThreadTs
	});
	const inactiveError = (message) => {
		throwAgentRunRestartAbortReason(attemptSignal?.aborted ? attemptSignal.reason : workSignal?.reason);
		return new Error(message);
	};
	function assertActive() {
		if (!active || attempt.admittedRunContext.operationalRunInstance !== operationalRunInstance || getAdmittedRunDelegatedAuthority(attempt.admittedRunContext) !== delegatedAuthority || callerIdentity?.gatewayContextResolver !== void 0 && callerIdentity.gatewayContextResolver() === void 0) throw inactiveError("agent harness host capability is no longer active");
		if (sourceCaller && (sourceCaller.agentId !== attempt.agentId || sourceCaller.sessionKey !== attempt.sessionKey) || sourceCaller?.workerTurnClaim && (sourceCaller.workerTurnClaim.sessionId !== attempt.sessionId || sourceCaller.workerTurnClaim.runId !== attempt.runId) || sourceCaller?.workerTurnClaim && !sourceCaller.receiptAuthority || sourceCaller?.receiptAuthority?.() === false) throw new Error("agent harness host capability lost its source execution claim");
	}
	const observeCoreTtsToolResult = (result) => {
		if (typeof result === "object" && result !== null && getCoreTtsToolResultMediaUrls(result)) coreTtsToolResults.add(result);
	};
	const requester = {
		...attempt.messageChannel ?? attempt.messageProvider ? { channel: attempt.messageChannel ?? attempt.messageProvider ?? void 0 } : {},
		...attempt.agentAccountId ? { accountId: attempt.agentAccountId } : {},
		...attempt.senderId ? { senderId: attempt.senderId } : {},
		...attempt.senderIsOwner !== void 0 ? { senderIsOwner: attempt.senderIsOwner } : {},
		...attempt.memberRoleIds?.length ? { roleIds: Object.freeze([...attempt.memberRoleIds]) } : {}
	};
	const config = attempt.config ? cloneSnapshot(attempt.config) : void 0;
	const hostSandboxEnabled = attempt.sandbox?.enabled === true;
	const prepareContextMedia = bindHarnessContextMedia({
		attempt,
		config,
		assertActive
	});
	const prepareReplyMedia = bindHarnessReplyMedia({
		attempt,
		config,
		assertActive,
		signal: capabilityAbortController.signal
	});
	const recorder = attempt.userTurnTranscriptRecorder;
	const sessionTarget = attempt.sessionTarget ? cloneSnapshot(attempt.sessionTarget) : void 0;
	const annotateCurrentUserTurn = attempt.userTurnTranscriptRecorder && attempt.sessionTarget && attempt.agentId && attempt.sessionId && attempt.sessionKey && attempt.sessionTarget.storePath && !attempt.suppressNextUserMessagePersistence && attempt.trigger !== "memory" ? bindUserTurnTranscriptAnnotation({
		recorder: attempt.userTurnTranscriptRecorder,
		target: {
			...attempt.sessionTarget,
			agentId: attempt.agentId,
			sessionId: attempt.sessionId,
			sessionKey: attempt.sessionKey,
			storePath: attempt.sessionTarget.storePath
		},
		runId: attempt.runId,
		config,
		abortSignal: attempt.abortSignal ? AbortSignal.any([attempt.abortSignal, capabilityAbortController.signal]) : capabilityAbortController.signal,
		assertCurrent: () => {
			assertActive();
			if (attempt.userTurnTranscriptRecorder !== recorder || !isDeepStrictEqual(attempt.sessionTarget, sessionTarget) || sessionTarget?.agentId !== void 0 && sessionTarget.agentId !== attempt.agentId || sessionTarget?.sessionId !== void 0 && sessionTarget.sessionId !== attempt.sessionId || sessionTarget?.sessionKey !== void 0 && sessionTarget.sessionKey !== attempt.sessionKey) throw new Error("native prompt annotation lost its source execution claim");
		}
	}) : void 0;
	const skillsSnapshot = attempt.skillsSnapshot ? cloneSnapshot(attempt.skillsSnapshot) : void 0;
	const preparedRunEnvironment = prepareGitHubToolEnvironment({
		config: config ?? {},
		sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig,
		agentId: attempt.agentId ?? "main"
	});
	const skillUsagePaths = attempt.sandbox?.skillUsagePaths ? cloneSnapshot(attempt.sandbox.skillUsagePaths) : void 0;
	const hookContext = Object.freeze({
		...attempt.agentId ? { agentId: attempt.agentId } : {},
		...config ? { config } : {},
		...attempt.cwd ? { cwd: attempt.cwd } : {},
		...attempt.workspaceDir ? { workspaceDir: attempt.workspaceDir } : {},
		...attempt.sessionKey ? { sessionKey: attempt.sessionKey } : {},
		...attempt.sessionId ? { sessionId: attempt.sessionId } : {},
		runId: attempt.runId,
		...buildAgentHookContextChannelFields(attempt),
		...Object.keys(requester).length > 0 ? { requester: Object.freeze(requester) } : {},
		...getActiveDiagnosticTraceContext() ? { trace: getActiveDiagnosticTraceContext() } : {},
		...skillsSnapshot ? { skillsSnapshot } : {},
		...skillUsagePaths ? { skillUsagePaths } : {},
		...attempt.onToolOutcome ? { onToolOutcome: attempt.onToolOutcome } : {},
		...attempt.allocateToolOutcomeOrdinal ? { allocateToolOutcomeOrdinal: attempt.allocateToolOutcomeOrdinal } : {},
		...attempt.sandbox?.enabled && attempt.sandbox.workspaceAccess === "rw" && attempt.sandbox.fsBridge ? { sandbox: Object.freeze({
			root: attempt.sandbox.workspaceDir,
			bridge: attempt.sandbox.fsBridge
		}) } : {},
		loopDetection: cloneSnapshot(resolveToolLoopDetectionConfig({
			cfg: config,
			agentId: attempt.agentId
		})),
		trigger: attempt.trigger,
		approvalReviewerDeviceId: attempt.approvalReviewerDeviceId,
		turnSourceChannel: attempt.messageChannel ?? attempt.messageProvider,
		turnSourceTo: attempt.currentMessagingTarget ?? attempt.currentChannelId,
		turnSourceAccountId: attempt.agentAccountId,
		turnSourceThreadId: attempt.currentThreadTs
	});
	const withCaller = async (run, signal) => await withGatewayToolCallerIdentity(callerIdentity && signal ? {
		...callerIdentity,
		approvalSignals: [...callerIdentity.approvalSignals ?? [], signal]
	} : callerIdentity, run);
	const runBeforeToolCallWithAssertion = async (assertCurrent, { nativeOperation, approvalMode, ...request }) => {
		assertCurrent();
		const hostApprovalMode = approvalMode === "defer" ? "defer" : "request";
		const actionCwd = nativeOperation?.cwd !== void 0 ? normalizeNativeOperationCwd(nativeOperation.cwd, hookContext.cwd) : void 0;
		const actionHookContext = actionCwd ? Object.freeze({
			...hookContext,
			cwd: actionCwd
		}) : hookContext;
		const result = await runBeforeToolCallHook({
			...request,
			approvalMode: hostApprovalMode,
			ctx: actionHookContext
		});
		assertCurrent();
		return result;
	};
	const runBeforeToolCall = async (request) => await withCaller(async () => await runBeforeToolCallWithAssertion(assertActive, request), request.signal);
	registerAgentHarnessBeforeToolCallRetention(runBeforeToolCall, () => {
		const recovery = retainAdmittedRunBeforeToolCallRecovery(attempt.admittedRunContext);
		if (!recovery) return;
		const assertRecoveryActive = () => {
			if (attempt.abortSignal?.aborted || attempt.admittedRunContext.operationalRunInstance !== operationalRunInstance || callerIdentity?.gatewayContextResolver !== void 0 && callerIdentity.gatewayContextResolver() === void 0) throw inactiveError("agent harness retained host policy is no longer active");
			recovery.assertActive();
		};
		return Object.freeze({
			assertActive: assertRecoveryActive,
			release: recovery.release,
			runBeforeToolCall: async (request) => await runBeforeToolCallWithAssertion(assertRecoveryActive, request)
		});
	});
	const trajectoryRecorder = attempt.trajectoryRecorder;
	const scheduledToolSources = /* @__PURE__ */ new WeakMap();
	const bindTools = (tools, options, observeResult) => {
		assertActive();
		const boundAbortSignal = attempt.abortSignal ? AbortSignal.any([attempt.abortSignal, capabilityAbortController.signal]) : capabilityAbortController.signal;
		const bindingCwd = options?.cwd !== void 0 ? normalizeNativeOperationCwd(options.cwd, hookContext.cwd) : void 0;
		const bindingHookContext = bindingCwd ? Object.freeze({
			...hookContext,
			cwd: bindingCwd
		}) : hookContext;
		return tools.map((tool) => bindAgentToolSourceExecutionGuard(tool, assertActive)).map((tool) => rewrapToolWithBeforeToolCallHook(tool, bindingHookContext)).map((tool) => callerIdentity ? wrapToolWithGatewayCallerIdentity(tool, callerIdentity) : tool).map((tool) => wrapToolWithAbortSignal(tool, boundAbortSignal)).map((tool) => gateBoundTool(tool, assertActive, observeResult));
	};
	const bindToolSurface = (tools, options) => bindTools(tools, options, () => {});
	const capabilities = Object.freeze({
		kind: "agent-harness-host-capability",
		version: 1,
		assertActive,
		retainSourceAuthority: () => retainHarnessSource(attempt.admittedRunContext, assertActive),
		reportOutputTokens: (outputTokens) => {
			assertActive();
			const data = emitAgentRunOutputTokens({
				runId,
				lifecycleGeneration,
				sessionKey,
				outputTokens
			});
			if (data && onAgentEvent) runBestEffortCallback({
				label: "usage agent event",
				log: log$1,
				callback: () => onAgentEvent({
					stream: "usage",
					data
				})
			});
		},
		...annotateCurrentUserTurn ? { annotateCurrentUserTurn } : {},
		...prepareContextMedia ? { prepareContextMedia } : {},
		...prepareReplyMedia ? { prepareReplyMedia } : {},
		...trajectoryRecorder ? { trajectory: Object.freeze({
			recordEvent: (type, data) => {
				assertActive();
				trajectoryRecorder.recordEvent(type, data);
			},
			flush: async () => {
				assertActive();
				await trajectoryRecorder.flush();
				assertActive();
			}
		}) } : {},
		preparedEnvironment: () => {
			assertActive();
			return Object.freeze({
				credentialScrubEnv: Object.freeze({ ...preparedRunEnvironment.credentialScrubEnv }),
				localIdentityEnv: Object.freeze({ ...preparedRunEnvironment.localIdentityEnv }),
				managedLocalIdentity: preparedRunEnvironment.managedLocalIdentity,
				...localProcessEnv ? { localProcessEnv } : {}
			});
		},
		activeComputerContext: () => {
			assertActive();
			return buildActiveNodeContextText();
		},
		bindToolSurface,
		createToolSurface: (options, bindingOptions) => {
			assertActive();
			const tools = bindTools(withAgentQuestionAnswerAuthority(resolveAgentQuestionAnswerAuthority(capabilities), () => withInstallationTarget(installationTarget, () => createOpenClawCodingToolsInternal({
				...options,
				githubPublicationAvailable,
				skillsSnapshot: options?.skillsSnapshot ?? skillsSnapshot,
				skillUsagePaths: options?.skillUsagePaths ?? skillUsagePaths,
				operationalRunInstance
			}, !hostSandboxEnabled && !options?.sandbox?.enabled && options?.includeCoreTools !== false && options?.toolConstructionPlan?.includeBaseCodingTools !== false ? resolveSkillResourceCandidates(skillsSnapshot) : void 0))), bindingOptions, observeCoreTtsToolResult);
			for (const tool of tools) if (tool.name === "exec" || tool.name === "process") scheduledToolSources.set(tool, Object.freeze({
				targetTool: tool.name,
				execute: tool.execute
			}));
			return tools;
		},
		prepareMutableFileApproval: async (request) => {
			assertActive();
			const prepared = await prepareSystemRunMutableFileApproval(request);
			assertActive();
			if (!prepared.ok) return prepared;
			return Object.freeze({
				ok: true,
				requiresOneShot: prepared.requiresOneShot,
				revalidate: async () => {
					assertActive();
					const current = await prepared.revalidate();
					assertActive();
					return current;
				}
			});
		},
		runBeforeToolCall,
		requestApproval: async (request) => {
			assertActive();
			request.signal?.throwIfAborted();
			const releaseMcpBinding = request.mcpTool && request.toolCallId && request.isMcpToolApprovalActive && attempt.agentId ? registerMcpToolApprovalBinding({
				authority: delegatedAuthority,
				agentId: attempt.agentId,
				toolCallId: request.toolCallId,
				...request.mcpTool,
				isActive: () => {
					assertActive();
					return !request.signal?.aborted && request.isMcpToolApprovalActive();
				}
			}) : void 0;
			try {
				const result = await withCaller(async () => await withGatewayToolApprovalOwner(params.pluginId, async () => await callGatewayTool("plugin.approval.request", { timeoutMs: request.transportTimeoutMs ?? request.timeoutMs }, {
					...formatHarnessApprovalPresentation(request),
					...request.detail !== void 0 ? { detail: request.detail } : {},
					severity: request.severity,
					toolName: request.toolName,
					toolCallId: request.toolCallId,
					...request.mcpTool ? { mcpTool: request.mcpTool } : {},
					timeoutMs: request.timeoutMs,
					twoPhase: true,
					...request.allowedDecisions ? { allowedDecisions: request.allowedDecisions } : {}
				}, {
					expectFinal: false,
					requireAgentRuntimeIdentity: true,
					signal: request.signal
				})), request.signal);
				assertActive();
				request.signal?.throwIfAborted();
				return result;
			} finally {
				releaseMcpBinding?.();
			}
		},
		waitForApproval: async (request) => {
			assertActive();
			const result = await withCaller(async () => await callGatewayTool("plugin.approval.waitDecision", { timeoutMs: request.transportTimeoutMs ?? request.timeoutMs }, { id: request.approvalId }, { signal: request.signal }), request.signal);
			assertActive();
			if (result?.id !== request.approvalId) return;
			return {
				decision: result.decision,
				terminalReason: result.terminalReason
			};
		}
	});
	registerAgentHarnessScheduledToolProjectionCapability({
		hostCapabilities: capabilities,
		ownerPluginId: params.pluginId,
		create: (sourceTool, projection) => {
			assertActive();
			const source = scheduledToolSources.get(sourceTool);
			if (!source || sourceTool.name !== source.targetTool || sourceTool.execute !== source.execute) throw new Error("scheduled tool projection source was not created by this host capability");
			return createCronScheduledToolProjection(sourceTool, assertActive, source.targetTool, projection);
		}
	});
	registerAgentHarnessTtsProvenanceTransferCapability({
		hostCapabilities: capabilities,
		ownerPluginId: params.pluginId,
		transfer: (toolResult, attemptResult, eligibleMediaUrls) => {
			assertActive();
			if (typeof toolResult !== "object" || toolResult === null || !coreTtsToolResults.has(toolResult)) return attemptResult;
			return transferCoreTtsToolResultProvenance(toolResult, attemptResult, eligibleMediaUrls, operationalRunInstance);
		}
	});
	return {
		capabilities,
		runWithScope: (run) => {
			const nodeAuthorities = createSessionNodeAuthorities(attempt, params.pluginId, requiredNodeCommands, assertActive, attempt.abortSignal ? AbortSignal.any([attempt.abortSignal, capabilityAbortController.signal]) : capabilityAbortController.signal);
			return withPluginRuntimeGatewayRequestScope({
				isWebchatConnect: () => false,
				...getPluginRuntimeGatewayRequestScope(),
				...nodeAuthorities
			}, run);
		},
		close: () => {
			if (!active) return;
			active = false;
			capabilityAbortController.abort();
		}
	};
}
//#endregion
//#region src/agents/harness/result-classification.ts
/** Applies a harness classifier while replacing any stale prior classification. */
function applyAgentHarnessResultClassification(harness, result, params) {
	if (!harness.classify) return {
		...result,
		agentHarnessId: harness.id
	};
	const { agentHarnessResultClassification: _previousClassification, ...resultWithoutPrevious } = result;
	const classification = harness.classify(resultWithoutPrevious, params);
	if (!classification || classification === "ok") return {
		...resultWithoutPrevious,
		agentHarnessId: harness.id
	};
	return {
		...resultWithoutPrevious,
		agentHarnessId: harness.id,
		agentHarnessResultClassification: classification
	};
}
//#endregion
//#region src/agents/harness/lifecycle.ts
/**
* Agent harness lifecycle diagnostics wrapper.
*
* This module wraps harness attempts with context-engine support checks,
* diagnostic events, trace propagation, and result classification.
*/
function buildAgentHarnessContextEngineHostSupport(harness) {
	return {
		id: `agent-harness:${harness.id}`,
		label: `agent harness "${harness.id}"`,
		capabilities: harness.contextEngineHostCapabilities ?? []
	};
}
function assertAgentHarnessContextEngineSupport(harness, params) {
	if (!params.contextEngine || params.contextEngine.info.id === "legacy") return;
	assertContextEngineHostSupport({
		contextEngine: params.contextEngine,
		operation: "agent-run",
		host: buildAgentHarnessContextEngineHostSupport(harness)
	});
}
function agentHarnessDiagnosticBase(harness, params, trace) {
	const diagnosticTrace = trace ?? getActiveDiagnosticTraceContext();
	const channel = diagnosticChannel(params);
	return {
		runId: params.runId,
		sessionId: params.sessionId,
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
function diagnosticChannel(params) {
	return params.messageChannel ?? params.messageProvider;
}
function agentRunDiagnosticBase(params, trace) {
	const channel = diagnosticChannel(params);
	return {
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.sessionId ? { sessionId: params.sessionId } : {},
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
function withFallbackFinalizationDiagnosticTrace(result, trace) {
	if (result.diagnosticTrace || !trace) return result;
	return {
		...result,
		diagnosticTrace: freezeDiagnosticTraceContext(trace)
	};
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
			result: withFallbackFinalizationDiagnosticTrace(rawResult.result, activeHarnessTrace)
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
	const attemptParams = prepareHarnessFinalizationParams({
		...internalParams,
		operation: "settled-tool-finalization"
	}, isBuiltInOpenClawAgentHarness(harness));
	return await runAgentHarnessOperation(harness, params, () => runWithAgentRingZeroTools([], () => runAgentHarnessLifecycleFinalization(harness, attemptParams, () => finalizeSettledTurn({
		attempt: attemptParams,
		settledAttempt
	}))));
}
async function runAgentHarnessAttempt(params, nativeSessionRuntime) {
	let internalParams = params;
	if (nativeSessionRuntime) await nativeSessionRuntime.assertCurrent();
	const selection = nativeSessionRuntime?.auth === "native" ? buildSelectionDecision({
		harness: nativeSessionRuntime.harness,
		policy: {
			runtime: nativeSessionRuntime.harness.id,
			runtimeSource: "model"
		},
		selectedReason: "forced_plugin",
		candidates: []
	}) : selectPreparedAgentHarness(params);
	const harness = selection.harness;
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
	const ringZeroTools = internalParams.systemAgentTool ? [(await import("./system-agent-tool-DpWU4xjW.mjs")).createSystemAgentTool(internalParams.systemAgentTool)] : [];
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
			const preparedParams = selection.builtIn ? pluginAttempt.params : preparePluginHarnessParams(pluginAttempt.params, harness, nativePermissionsConsented);
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
				if (prepared.trigger !== "user" || !prepared.sessionKey) return runAgentHarnessLifecycleAttempt(harness, prepared);
				const note = await claimHeartbeatContextForUserRun({
					...prepared,
					agentId: resolveSessionAgentIds(prepared).sessionAgentId,
					storePath: prepared.sessionTarget?.storePath,
					detached: prepared.sessionPersistence === "detached",
					assertCurrent: resolveAdmittedRunActiveAssertion(internalParams.admittedRunContext, prepared.abortSignal)
				});
				if (!note) return runAgentHarnessLifecycleAttempt(harness, prepared);
				return runAgentHarnessLifecycleAttempt(harness, {
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
	await prepareActiveNodeContext();
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
		runWithHostScope: (run) => run()
	};
	const pluginParams = withoutPluginHarnessPrivateState(params);
	const host = createAgentHarnessHostCapabilities({
		attempt: params,
		requiredNodeCommands: harness.cloudPlacement?.devicePlacement?.requiredNodeCommands,
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
	const { admittedRunContext: _admittedRunContext, assistantErrorTranscript: _assistantErrorTranscript, compactionCountOwner: _compactionCountOwner, onContextAccountingEvent: _onContextAccountingEvent, onCompactionRequestBudget: _onCompactionRequestBudget, contextEngineLogicalTurnLease: _contextEngineLogicalTurnLease, hostCapabilities: _hostCapabilities, onContextEngineTurnCandidate: _onContextEngineTurnCandidate, trajectoryRecorder: _trajectoryRecorder, __openclawSourceReplyDeliveryRuntime: _sourceReplyDeliveryRuntime, ...pluginParams } = params;
	return pluginParams;
}
function preparePluginHarnessParams(params, harness, nativePermissionsConsented) {
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
	return nativePermissionsConsented ? policyParams : applyPluginHarnessDenyAllToolPolicy(policyParams, policies);
}
function applyPluginHarnessDenyAllToolPolicy(params, policies) {
	if (isHostScopedAgentToolActive("openclaw") && params.toolsAllow?.length === 1 && normalizeToolPolicyName(params.toolsAllow[0] ?? "") === "openclaw") return params;
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
function buildSelectionDecision(params) {
	return {
		...buildAgentHarnessSelectionDecision({
			...params,
			harness: isBuiltInOpenClawAgentHarness(params.harness) ? void 0 : params.harness
		}),
		harness: params.harness
	};
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
export { createAgentHarnessHostCapabilities as a, selectAgentHarnessForPreparedModelProviders as i, runAgentHarnessSettledTurnFinalization as n, selectAgentHarness as r, runAgentHarnessAttempt as t };
