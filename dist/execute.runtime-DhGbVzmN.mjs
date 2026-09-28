import { a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as racePromiseWithAbortSignal, t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { D as freezeDiagnosticTraceContext, F as markToolExecutionLivenessDiagnosticEvent, K as hasInternalDiagnosticEventListeners, T as createDiagnosticTraceContextFromActiveScope, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { s as sanitizeHostExecEnv } from "./host-env-security-D7wdDMke.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { o as resolveExecutablePath } from "./executable-path-BMRdcL7i.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-QODkv80i.mjs";
import { c as createCapturedOutputBuffers, s as appendCapturedOutput } from "./exec-shcN2-sN.mjs";
import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.mjs";
import { n as getInstallationTarget, r as installationTargetEnv, t as LOCAL_INSTALLATION_TARGET_UNSUPPORTED } from "./installation-target-context-CrBRhZSM.mjs";
import { t as NODE_AGENT_CLI_CLAUDE_RUN_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { r as mergePathPrepend } from "./path-prepend-CRp372y2.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { v as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-DO6Dg2r0.mjs";
import { i as emitAgentEvent, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { i as resolveWindowsExecutablePath, o as resolveWindowsSpawnProgramCandidate } from "./windows-spawn-CR3vyrK9.mjs";
import { s as recordAdjustedParamsForToolCall, x as runBeforeToolCallHook } from "./agent-tools.before-tool-call-Ub1aezaD.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-bWS25cgK.mjs";
import { o as resolveSystemEventQueueKey } from "./system-event-ownership-CHVGbaAW.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { t as applyPluginTextReplacements } from "./plugin-text-transforms-CuF3jf1R.mjs";
import { a as isFailoverError, o as isSignalTimeoutReason, t as FailoverError } from "./error-ON38hPhx.mjs";
import { i as loadExecApprovals } from "./exec-approvals-store-CTT-ox-I.mjs";
import { i as evaluateShellAllowlistWithAuthorization } from "./exec-approvals-allowlist-BcPQSHv1.mjs";
import { i as resolveExecApprovalsFromFile, l as recordAllowlistMatchesUse } from "./exec-approvals-BgZlQ2Qp.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { f as resolveAdmittedRunActiveAssertion, o as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { h as resolveCliToolTerminalReason } from "./run-termination-Cd1iJzC7.mjs";
import { n as isAgentPlanProgressToolName } from "./progress-card-input-CXyAxVII.mjs";
import { d as resolveReplyExpectation } from "./source-reply-delivery-mode-Byvky-I7.mjs";
import { c as resolveFastModeForElapsed } from "./fast-mode-CF9HctjM.mjs";
import { _ as BLOCKED_TOOL_CALL_ABORT_FLOOR_MS, h as beginDiagnosticBackendActivity } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
import { i as getGatewayToolCallerIdentity, n as createAdmittedGatewayToolCallerIdentity, o as withGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { t as getProcessSupervisor } from "./supervisor-Dye57EtO.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-CfRBR4Iu.mjs";
import { t as classifyFailoverReason } from "./classify-Bgiif0yb.mjs";
import { p as resolveFailoverStatus } from "./failover-error-BwAkMLuL.mjs";
import "./embedded-agent-helpers-DyKvGnUW.mjs";
import { n as diagnosticErrorFailureKind, r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-DSynPRwg.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy, t as cloneDiagnosticContentValue } from "./diagnostic-llm-content-pAJxJAOh.mjs";
import { o as readToolResultDetails } from "./tool-result-error-CWadvCKd.mjs";
import { a as sanitizeExecApprovalWarningTextWithStatus, t as exceedsApprovalTextLimit } from "./exec-approval-text-sanitize-B7wKpPNH.mjs";
import { n as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, p as truncatePluginApprovalDetail } from "./plugin-approvals-DV5u4TwS.mjs";
import { t as callGatewayTool } from "./gateway-DVDJurQC.mjs";
import { a as isMessagingToolSendAction, i as isMessagingToolDeliveryAction, o as isMessagingToolTargetEvidenceAction, r as isMessagingTool } from "./embedded-agent-messaging-D4Zw3sB3.mjs";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-Ce7FXvzS.mjs";
import { d as withAgentQuestionAnswerAuthority } from "./host-private-capabilities-D8EEgJHq.mjs";
import { a as resolveQuestionTimeoutMs } from "./ask-user-tool-normalization-2WsyzPxb.mjs";
import { i as isCurrentPlacementTurnClaim } from "./placement-record-CB6gcJKw.mjs";
import { t as createNodeDuplexEndpoint } from "./node-duplex-framing-A5ewuqpE.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
import { i as scopedHeartbeatWakeOptionsForPolicy, n as resolveEventSessionRoutingPolicy, t as resolveEventSessionKeyForPolicy } from "./event-session-routing-Dc7D6ZvV.mjs";
import { n as resolveExecDefaults } from "./exec-defaults-aBiGwrXO.mjs";
import "./fast-mode-D3LS63Ki.mjs";
import { n as applySkillEnvOverridesFromSnapshot } from "./env-overrides-UaEGAD3i.mjs";
import { n as hasHydratableMediaImages } from "./images.media-refs-B62GCpdx.mjs";
import { r as detectImageReferences } from "./images-B49_fdB_.mjs";
import { r as projectAgentToolActivity } from "./agent-activity-events-DJmgjmUx.mjs";
import { c as sanitizeToolResult, i as extractToolErrorMessage, s as sanitizeToolArgs } from "./embedded-agent-tool-results-Cn4G9Xfj.mjs";
import { a as projectProgressCardChannelUpdate, c as extractToolResultMediaArtifact, i as isDeliveredMessagingToolSendToCurrentSource, l as filterToolResultMediaUrls, n as extractMessagingToolSendResult, o as collectMessagingMediaUrlsFromRecord, r as extractMessagingToolSourceReplyPayload, s as collectMessagingMediaUrlsFromToolResult, t as extractMessagingToolSend } from "./embedded-agent-messaging-extraction-CBKOTOh9.mjs";
import { c as readEmbeddedMessageDeliveryFact } from "./embedded-agent-message-delivery-BkG-vmHL.mjs";
import { i as normalizeAcceptedSessionSpawnResult } from "./accepted-session-spawn-4qfWSWlu.mjs";
import { i as resolveMessageToolSourceReplyFinal, n as isDeliveredMessagingToolResult, t as isDeliveredMessageToolOnlySourceReplyResult } from "./embedded-agent-message-tool-source-reply-D3_TCT19.mjs";
import { t as createModelCallStreamProgressReporter } from "./diagnostic-model-stream-progress-BYmYyMRB.mjs";
import { n as resolveExecToolConfig } from "./lazy-exec-tool-B8AAw-gA.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-CHx7Z_89.mjs";
import { t as shouldUseInternalSourceReplySink } from "./internal-source-reply-R34TAD7p.mjs";
import { a as resolveRegisteredExecApprovalDecision, i as registerExecApprovalRequestForHostOrThrow } from "./bash-tools.exec-approval-request-DyomQPYD.mjs";
import { c as prepareSystemRunMutableFileBinding, u as revalidateSystemRunMutableFileBinding } from "./system-run-approval-binding-BDEolZhR.mjs";
import { r as stripOpenClawMcpToolPrefix, t as normalizeCliToolName } from "./tool-policy-B3nZbUgX.mjs";
import { t as createPluginToolsMcpHandlers } from "./plugin-tools-handlers-BYstQ71a.mjs";
import { a as resolveCliRuntimeOwnerFingerprint, o as resolveCliExecutableIdentity, t as fingerprintCliRuntimeArtifact } from "./cli-auth-epoch-B8HYTC0l.mjs";
import { c as encodeNodeClaudeSkillMessage, i as NODE_CLAUDE_WORKSHOP_RESULT_BYTES, n as NODE_CLAUDE_SKILLS_MESSAGE_BYTES, o as NodeClaudeSkillUpstreamSchema } from "./node-claude-skill-protocol-vz147HUx.mjs";
import { n as prepareSkillResourceDelivery } from "./resources-bsOukbsq.mjs";
import { t as buildAuthorizedShellCommandFromPlan } from "./exec-authorization-render-BlItVswD.mjs";
import { n as hashCliImageTurnEntryId } from "./cli-image-turn-correlation-BVjxe73p.mjs";
import { n as cliBackendLog, r as formatCliBackendOutputDigest, t as CLI_BACKEND_LOG_OUTPUT_ENV } from "./log-lbZDIx37.mjs";
import { c as resolvePromptInput, d as writeCliSystemPromptFile, f as buildCliSupervisorScopeKey, i as isClaudeCliBackendId, l as resolveSessionIdToSend, m as resolveCliRunTimeoutOverrideMs, n as buildCliArgs, o as prepareCliPromptImagePayload, p as resolveCliNoOutputTimeoutMs, r as enqueueCliRun, s as resolveCliRunQueueKey, u as resolveSystemPromptUsage } from "./helpers-BIwgJvqv.mjs";
import { r as compileStructuredInputQuestions, t as runStructuredInput } from "./structured-input-execution-CggZ-iAA.mjs";
import { i as prepareCliBundleMcpCaptureAttempt, n as composeCliPromptContext } from "./prompt-context-CFHVUjG9.mjs";
import { a as getCliLiveSessionApprovalGrants, c as restartCliLiveSession, d as resolveCliResumeAtError, f as formatCliOutputError, g as createCliRunCurrentAssertion, h as transformCliResultText, i as createCliLiveSessionCapability, l as createCliExitFailoverError, m as createCliJsonlStreamingParser, n as buildCliLiveOwnerKey, p as parseCliOutput, r as closeCliLiveSession, t as acceptsCliLiveSession, u as createCliFailoverError, y as runCliCleanup } from "./cli-live-session-registry-CVRY7R5X.mjs";
import { t as buildMcpToolSchema } from "./mcp-http.schema-BZBf_SU-.mjs";
import { g as waitForMcpLoopbackToolCallCaptureIdle, r as clearMcpLoopbackToolCallCapture, t as beginMcpLoopbackToolCallCapture } from "./mcp-http.loopback-runtime-CFrmBr1v.mjs";
import { r as projectCliMessagingDeliveryEvidence, t as attachCliMessagingDeliveryEvidence } from "./delivery-evidence-DH2y_idP.mjs";
import { isDeepStrictEqual } from "node:util";
import crypto, { randomUUID } from "node:crypto";
import { parse } from "semver";
import { Value } from "typebox/value";
import { stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
//#region src/gateway/node-claude-skill-runtime.ts
/** Captures the real session assignment, connection, and admitted owner before any file work. */
async function prepareNodeClaudeSkillRuntime(context, signal) {
	const run = context.params;
	if (run.controlOperation || !run.skillsSnapshot?.librarySelections?.length && !context.nodeSkillWorkshop) return;
	const gateway = getPluginRuntimeGatewayRequestScope()?.context;
	const target = context.executionTarget;
	const node = target.kind === "node" ? gateway?.nodeRegistry.get(target.placement.nodeId) : void 0;
	if (!gateway || !node || !node.caps.includes("claude-cli-skills-v1")) throw new Error("Paired node needs claude-cli-skills-v1. Upgrade OpenClaw on the paired node, restart its node host, and retry this turn.");
	const assertRun = resolveAdmittedRunActiveAssertion(run.admittedRunContext, signal);
	if (!assertRun || !run.sessionKey) throw new Error("Paired-node skills require a live admitted session. Send a fresh message.");
	const sessionScope = {
		sessionKey: run.sessionKey,
		agentId: run.agentId,
		storePath: run.storePath,
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	};
	const session = loadSessionEntryReadOnly(sessionScope);
	const connectionId = node.connId;
	const pairingGeneration = node.pairingGeneration;
	const caller = getGatewayToolCallerIdentity();
	const placements = gateway.workerSessionPlacementService;
	const readPlacement = () => placements?.getMany([run.sessionId]).get(run.sessionId);
	const placement = readPlacement();
	const persistedClaim = placement?.turnClaim;
	const claim = persistedClaim?.owner === "local" ? {
		sessionId: run.sessionId,
		claimId: persistedClaim.claimId,
		runId: persistedClaim.runId,
		placementGeneration: persistedClaim.generation,
		owner: {
			kind: "local",
			...placement?.environmentId && placement.activeOwnerEpoch !== null ? {
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch
			} : {}
		}
	} : void 0;
	const controller = new AbortController();
	const owner = getAdmittedRunDelegatedAuthority(run.admittedRunContext);
	const stop = registerAgentRunDelegatedAuthorityClosedHandler((closed) => {
		if (closed === owner) controller.abort(/* @__PURE__ */ new Error("Paired-node skill run authority closed."));
	});
	const stopClaim = claim && placement ? placements?.registerTurnClaimClosedHandler?.((ended) => {
		if (ended.sessionId === run.sessionId && isCurrentPlacementTurnClaim(placement, ended)) controller.abort(/* @__PURE__ */ new Error("Paired-node skill placement claim closed."));
	}) : void 0;
	const combinedSignal = AbortSignal.any([signal, controller.signal]);
	let closed = false;
	const close = () => {
		closed = true;
		stop();
		stopClaim?.();
		controller.abort();
	};
	const assertCurrent = () => {
		assertRun();
		combinedSignal.throwIfAborted();
		const current = loadSessionEntryReadOnly(sessionScope);
		const currentPlacement = readPlacement();
		if (closed || gateway.nodeRegistry.get(node.nodeId) !== node || node.connId !== connectionId || node.pairingGeneration !== pairingGeneration || node.client.socket.readyState !== 1 || !node.caps.includes("claude-cli-skills-v1") || !isNodeCommandAllowed({
			command: "agent.cli.claude.run.v1",
			declaredCommands: node.commands,
			allowlist: resolveNodeCommandAllowlist(gateway.getRuntimeConfig(), {
				...node,
				approvedCommands: node.commands
			})
		}).ok || !session || session.sessionId !== run.sessionId || (run.expectedLifecycleRevision ?? run.sessionEntry?.lifecycleRevision) !== void 0 && session.lifecycleRevision !== (run.expectedLifecycleRevision ?? run.sessionEntry?.lifecycleRevision) || current?.sessionId !== session.sessionId || current.lifecycleRevision !== session.lifecycleRevision || current.execHost !== "node" || current.execNode?.trim() !== node.nodeId || (current.execCwd?.trim() || void 0) !== (target.kind === "node" ? target.placement.cwd : void 0) || caller?.receiptAuthority && caller.receiptAuthority() === false || currentPlacement?.generation !== placement?.generation || currentPlacement?.environmentId !== placement?.environmentId || currentPlacement?.activeOwnerEpoch !== placement?.activeOwnerEpoch || placement && (!claim || !stopClaim || claim.runId !== run.runId || !currentPlacement || !isCurrentPlacementTurnClaim(currentPlacement, claim))) throw new Error("Paired-node skill assignment or run authority changed. Retry from a fresh turn.");
	};
	try {
		assertCurrent();
		const resources = run.skillsSnapshot?.librarySelections?.length ? await prepareSkillResourceDelivery(run.skillsSnapshot, assertCurrent, [], context.workspaceDir) : void 0;
		assertCurrent();
		const workshop = context.nodeSkillWorkshop;
		const descriptor = workshop ? buildMcpToolSchema([workshop])[0] : void 0;
		const init = {
			type: "init",
			...resources ? { resources } : {},
			...descriptor ? { workshop: {
				description: descriptor.description ?? "",
				inputSchema: descriptor.inputSchema
			} } : {}
		};
		encodeNodeClaudeSkillMessage(init, NODE_CLAUDE_SKILLS_MESSAGE_BYTES);
		return {
			node,
			run,
			init,
			workshop,
			assertCurrent,
			signal: combinedSignal,
			close
		};
	} catch (error) {
		close();
		throw error;
	}
}
/** One invocation owns resource delivery, stdout, and host-only Workshop callbacks. */
async function invokeNodeClaudeSkillRuntime(params) {
	const { runtime, registry } = params;
	runtime.assertCurrent();
	const controller = new AbortController();
	const signal = AbortSignal.any([runtime.signal, controller.signal]);
	let invokeId;
	let open = true;
	const assertCurrent = () => {
		runtime.assertCurrent();
		signal.throwIfAborted();
		if (!open || !invokeId || !registry.isInvokeCurrent(invokeId, runtime.node.nodeId, runtime.node.connId)) throw new Error("Paired-node Workshop invocation is no longer active.");
	};
	const identity = createAdmittedGatewayToolCallerIdentity({
		admittedRunContext: runtime.run.admittedRunContext,
		agentId: runtime.run.agentId,
		sessionKey: runtime.run.sessionKey,
		receiptAuthority: assertCurrent
	});
	const handlers = createPluginToolsMcpHandlers(runtime.workshop ? [runtime.workshop] : []);
	const calls = /* @__PURE__ */ new Set();
	const callbacks = /* @__PURE__ */ new Set();
	const endpoint = createNodeDuplexEndpoint({
		requireReady: true,
		maxMessageBytes: NODE_CLAUDE_SKILLS_MESSAGE_BYTES,
		sendFrame(frame) {
			assertCurrent();
			registry.sendInvokeInput(invokeId, frame);
		},
		onReady() {
			assertCurrent();
			endpoint.send(encodeNodeClaudeSkillMessage(runtime.init, NODE_CLAUDE_SKILLS_MESSAGE_BYTES)).catch((error) => controller.abort(error));
		},
		onError: (error) => controller.abort(error)
	});
	const receive = async (bytes) => {
		assertCurrent();
		if (bytes.byteLength > 67108864) throw new Error("Paired-node Workshop request exceeds its limit.");
		const message = JSON.parse(Buffer.from(bytes).toString("utf8"));
		if (!Value.Check(NodeClaudeSkillUpstreamSchema, message)) throw new Error("Invalid paired-node skill message.");
		if (message.type === "stdout") {
			params.onProgress(message.text);
			return;
		}
		if (!runtime.workshop || !identity || calls.has(message.id) || calls.size >= 64) throw new Error("Paired-node Workshop callback is unavailable or already consumed. Send a fresh message.");
		calls.add(message.id);
		const result = await withGatewayToolCallerIdentity(identity, () => handlers.callTool({
			name: "skill_workshop",
			arguments: message.arguments
		}, signal));
		assertCurrent();
		await endpoint.send(encodeNodeClaudeSkillMessage({
			type: "result",
			id: message.id,
			result
		}, NODE_CLAUDE_WORKSHOP_RESULT_BYTES));
	};
	endpoint.onMessage((bytes) => {
		const callback = receive(bytes).finally(() => callbacks.delete(callback));
		callbacks.add(callback);
		return callback;
	});
	const abort = () => endpoint.close();
	signal.addEventListener("abort", abort, { once: true });
	try {
		return await registry.invoke({
			...params.invocation,
			signal,
			expectedConnId: runtime.node.connId,
			expectedPairingGeneration: runtime.node.pairingGeneration,
			isDispatchAuthorized: () => {
				runtime.assertCurrent();
				return !signal.aborted && params.invocation.isDispatchAuthorized?.() !== false;
			},
			onDispatchReady: (id) => {
				invokeId = id;
			},
			onProgress: (chunk) => {
				assertCurrent();
				endpoint.receive(chunk);
			}
		});
	} finally {
		open = false;
		controller.abort();
		signal.removeEventListener("abort", abort);
		endpoint.close();
		await Promise.allSettled(callbacks);
	}
}
//#endregion
//#region src/gateway/node-agent-cli-runtime.ts
/** In-process Gateway seam for streaming a Claude CLI turn from a paired node. */
async function invokeNodeClaudeCliRun(params) {
	const context = getPluginRuntimeGatewayRequestScope()?.context;
	if (!context) return {
		ok: false,
		error: {
			code: "UNAVAILABLE",
			message: "Gateway node runtime unavailable"
		}
	};
	const node = context.nodeRegistry.get(params.nodeId);
	if (!node || !node.commands.includes("agent.cli.claude.run.v1")) return {
		ok: false,
		error: {
			code: "UNAVAILABLE",
			message: "paired node does not advertise Claude CLI agent runs"
		}
	};
	const allowlist = resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
		...node,
		approvedCommands: node.commands
	});
	const allowed = isNodeCommandAllowed({
		command: NODE_AGENT_CLI_CLAUDE_RUN_COMMAND,
		declaredCommands: node.commands,
		allowlist
	});
	if (!allowed.ok) return {
		ok: false,
		error: {
			code: "PERMISSION_DENIED",
			message: `paired-node Claude CLI agent runs are blocked by node command policy (${allowed.reason})`
		}
	};
	params.skillRuntime?.assertCurrent();
	const invocation = {
		nodeId: params.nodeId,
		expectedConnId: node.connId,
		...node.pairingGeneration ? { expectedPairingGeneration: node.pairingGeneration } : {},
		command: NODE_AGENT_CLI_CLAUDE_RUN_COMMAND,
		params: {
			argv: params.argv,
			stdin: params.stdin,
			...params.cwd ? { cwd: params.cwd } : {},
			...params.env ? { env: params.env } : {},
			...params.clearEnv ? { clearEnv: params.clearEnv } : {},
			...params.systemPrompt !== void 0 ? { systemPrompt: params.systemPrompt } : {},
			...params.agentId ? { agentId: params.agentId } : {},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.approvalDecision ? { approvalDecision: params.approvalDecision } : {},
			...params.systemRunPlan ? { systemRunPlan: params.systemRunPlan } : {},
			idleTimeoutMs: params.idleTimeoutMs,
			timeoutMs: params.timeoutMs,
			...params.skillRuntime ? { skillRuntime: true } : {}
		},
		timeoutMs: params.timeoutMs,
		idleTimeoutMs: params.idleTimeoutMs,
		idempotencyKey: randomUUID(),
		onProgress: params.onProgress,
		...params.signal ? { signal: params.signal } : {},
		isDispatchAuthorized: () => {
			params.assertCurrent?.();
			return true;
		}
	};
	return params.skillRuntime ? await invokeNodeClaudeSkillRuntime({
		registry: context.nodeRegistry,
		invocation,
		runtime: params.skillRuntime,
		onProgress: params.onProgress
	}) : await context.nodeRegistry.invoke(invocation);
}
//#endregion
//#region src/agents/cli-runner/no-output-timeout-policy.ts
const isReplaySafeCliResumeControlOnly = (useResume, ...unsafe) => useResume && !unsafe.some(Boolean);
function resolveCliNoOutputTimeoutDecision(params) {
	const outstandingWork = params.cliTimeout.activeToolCount + params.cliTimeout.backgroundTaskCount > 0;
	const deferMs = outstandingWork && params.outstandingWorkGraceMs !== void 0 ? Math.max(params.timeoutMs, params.outstandingWorkGraceMs) - params.quietDurationMs : void 0;
	const retryable = !params.cliTimeout.observedActivity && !params.hasOutputText || params.allowResumeControlOnlyRetry === true && isReplaySafeCliResumeControlOnly(params.useResume, params.hasOutputText, params.hasReplayUnsafeActivity, outstandingWork);
	return {
		...deferMs !== void 0 && deferMs > 0 ? { deferMs } : {},
		error: createCliTimeoutError(params.context, params.cliTimeout, retryable ? "cli_no_output_timeout" : void 0)
	};
}
function createCliTimeoutError(context, cliTimeout, code) {
	return createCliFailoverError(cliTimeout.mode === "no-output" ? `CLI produced no output for ${cliTimeout.timeoutSeconds}s and was terminated.` : `CLI exceeded timeout (${cliTimeout.timeoutSeconds}s) and was terminated.`, "timeout", context, {
		code,
		cliTimeout,
		timeout: { timeoutPhase: "provider" }
	});
}
//#endregion
//#region src/agents/cli-runner/execute-plugin-watchdog.ts
const HOST_SUSPEND_TICK_THRESHOLD_MS = 45e3;
const WATCHDOG_TICK_MS = 1e3;
const defaultCliWatchdogClock = {
	now: () => Date.now(),
	setTimeout: (callback, delayMs) => {
		const timer = setTimeout(callback, delayMs);
		return () => clearTimeout(timer);
	}
};
function createCliPluginWatchdog(params, clock = defaultCliWatchdogClock) {
	const noOutputTimeoutMs = params.noOutputTimeoutMs;
	const overallTimeoutMs = params.overallTimeoutMs;
	let lastOutputAtMs = clock.now();
	let noOutputDeadlineMs = 0;
	let overallActiveRemainingMs = overallTimeoutMs;
	let timer;
	let lastTickAtMs = clock.now();
	let scheduledTickAtMs = lastTickAtMs;
	let disposed = false;
	const dispose = () => {
		disposed = true;
		timer?.();
		timer = void 0;
	};
	const scheduleTick = () => {
		if (disposed || noOutputTimeoutMs === void 0 && overallTimeoutMs === void 0) return;
		const nowMs = clock.now();
		const nextDelayMs = Math.min(noOutputTimeoutMs === void 0 ? Number.POSITIVE_INFINITY : noOutputDeadlineMs - nowMs, overallActiveRemainingMs === void 0 ? Number.POSITIVE_INFINITY : overallActiveRemainingMs - Math.max(0, nowMs - lastTickAtMs), WATCHDOG_TICK_MS);
		const nextTickAtMs = nowMs + Math.max(1, nextDelayMs);
		if (timer !== void 0 && scheduledTickAtMs <= nextTickAtMs) return;
		timer?.();
		scheduledTickAtMs = nextTickAtMs;
		timer = clock.setTimeout(tick, nextTickAtMs - nowMs);
	};
	const tick = () => {
		timer = void 0;
		const nowMs = clock.now();
		const elapsedMs = Math.max(0, nowMs - lastTickAtMs);
		lastTickAtMs = nowMs;
		const suspendedMs = elapsedMs >= HOST_SUSPEND_TICK_THRESHOLD_MS ? Math.max(0, nowMs - scheduledTickAtMs) : 0;
		if (suspendedMs > 0) {
			const frozenStartMs = nowMs - suspendedMs;
			const creditedMs = Math.max(0, nowMs - Math.max(lastOutputAtMs, frozenStartMs));
			lastOutputAtMs += creditedMs;
			noOutputDeadlineMs += creditedMs;
			cliBackendLog.info(`cli watchdog credited timer gap: provider=${params.provider} model=${params.model} suspendedMs=${Math.round(suspendedMs)} creditedMs=${Math.round(creditedMs)}`);
		}
		const activeElapsedMs = elapsedMs - suspendedMs;
		if (overallActiveRemainingMs !== void 0) {
			overallActiveRemainingMs -= activeElapsedMs;
			if (overallActiveRemainingMs <= 0) {
				dispose();
				params.onOverallTimeout();
				return;
			}
		}
		if (noOutputTimeoutMs !== void 0 && nowMs >= noOutputDeadlineMs) {
			const quietDurationMs = nowMs - lastOutputAtMs;
			const askUserDeadline = params.getActiveAskUserDeadline?.();
			const decision = resolveCliNoOutputTimeoutDecision({
				context: {
					provider: params.provider,
					model: params.model,
					sessionId: params.sessionId,
					lane: params.lane
				},
				timeoutMs: noOutputTimeoutMs,
				quietDurationMs,
				cliTimeout: {
					mode: "no-output",
					timeoutSeconds: Math.round(quietDurationMs / 1e3),
					observedActivity: params.hasObservedActivity(),
					activeToolCount: params.activeToolCount(),
					backgroundTaskCount: params.backgroundTaskCount()
				},
				hasOutputText: false,
				useResume: params.useResume,
				hasReplayUnsafeActivity: params.hasReplayUnsafeActivity(),
				allowResumeControlOnlyRetry: true,
				outstandingWorkGraceMs: askUserDeadline === void 0 ? BLOCKED_TOOL_CALL_ABORT_FLOOR_MS : Math.max(BLOCKED_TOOL_CALL_ABORT_FLOOR_MS, askUserDeadline - lastOutputAtMs)
			});
			if (decision.deferMs !== void 0) noOutputDeadlineMs = nowMs + decision.deferMs;
			else {
				dispose();
				params.onNoOutputTimeout(decision.error);
				return;
			}
		}
		scheduleTick();
	};
	const reset = () => {
		if (disposed) return;
		if (noOutputTimeoutMs !== void 0) {
			const baselineDeadline = lastOutputAtMs + noOutputTimeoutMs;
			const askUserDeadline = params.getActiveAskUserDeadline?.();
			noOutputDeadlineMs = askUserDeadline === void 0 ? baselineDeadline : Math.max(baselineDeadline, askUserDeadline);
		}
		scheduleTick();
	};
	return {
		noteOutput: () => {
			lastOutputAtMs = clock.now();
			reset();
		},
		reset,
		dispose
	};
}
//#endregion
//#region src/agents/cli-runner/execute-deps.ts
const executeDeps = {
	watchdogClock: defaultCliWatchdogClock,
	getProcessSupervisor,
	enqueueSystemEvent,
	requestHeartbeat: requestSessionEventWake,
	writeCliSystemPromptFile,
	invokeNodeClaudeCliRun,
	registerExecApprovalRequestForHostOrThrow,
	resolveRegisteredExecApprovalDecision
};
//#endregion
//#region src/agents/cli-runner/execute-events.ts
function resolveCliToolSource(name, kind) {
	return kind === "mcp_tool_use" || name.startsWith("mcp__") ? "mcp" : "core";
}
function createCliEventHandlers(params) {
	const context = params.context;
	const runParams = context.params;
	const emitLiveEvents = runParams.executionMode !== "side-question";
	let observedCliActivity = false;
	let signaledToolExecutionStarted = false;
	let signaledAssistantOutputStarted = false;
	let commentaryCounter = 0;
	const toolSummaryById = /* @__PURE__ */ new Map();
	const toolArgsByCallId = /* @__PURE__ */ new Map();
	const emitToolEvent = (data, execution) => {
		const item = projectAgentToolActivity({
			...data,
			name: stripOpenClawMcpToolPrefix(data.name),
			args: execution ? execution.args : data.args
		});
		const activity = {
			runId: runParams.runId,
			stream: "item",
			data: item
		};
		if (data.phase === "start") emitAgentEvent(activity);
		emitAgentEvent({
			runId: runParams.runId,
			stream: "tool",
			data
		});
		if (data.phase !== "start") emitAgentEvent(activity);
	};
	const toolSummaryNames = [];
	const toolSummaryNameSet = /* @__PURE__ */ new Set();
	const activeParsedTools = /* @__PURE__ */ new Map();
	const rememberToolName = (name) => {
		if (!name || toolSummaryNameSet.has(name)) return;
		toolSummaryNameSet.add(name);
		toolSummaryNames.push(name);
	};
	const recordToolSummary = (event, failed) => {
		let current = toolSummaryById.get(event.toolCallId);
		if (current) {
			current.failed ||= failed;
			if (!current.name && event.name) current.name = event.name;
		} else {
			current = {
				name: event.name,
				failed
			};
			toolSummaryById.set(event.toolCallId, current);
		}
		rememberToolName(event.name);
		return current;
	};
	const getToolSummary = () => ({
		calls: toolSummaryById.size,
		tools: toolSummaryNames.slice(),
		failures: Array.from(toolSummaryById.values()).filter((entry) => entry.failed).length
	});
	const emitToolUseStart = (event, tracked) => {
		observedCliActivity = true;
		toolArgsByCallId.set(event.toolCallId, {
			args: event.args,
			tracked,
			startedAt: Date.now()
		});
		recordToolSummary(event, false);
		if (!signaledToolExecutionStarted) {
			signaledToolExecutionStarted = true;
			runParams.onExecutionPhase?.({
				phase: "tool_execution_started",
				provider: runParams.provider,
				model: context.modelId,
				backend: context.backendResolved.id
			});
		}
		if (tracked) params.toolTracking.handleCliToolUseStart(event);
		if (emitLiveEvents) emitToolEvent({
			phase: "start",
			name: event.name,
			toolCallId: event.toolCallId,
			args: sanitizeToolArgs(event.args)
		});
	};
	const emitToolResult = (event, tracked) => {
		observedCliActivity = true;
		const summary = recordToolSummary(event, event.isError);
		const firstTerminal = !summary.terminalObserved;
		summary.terminalObserved = true;
		const loopbackOutcome = tracked ? params.toolTracking.resolveCliLoopbackTerminalOutcome(event.toolCallId) : void 0;
		const executedArgs = tracked ? params.toolTracking.handleCliToolResult(event) : void 0;
		const startedCall = toolArgsByCallId.get(event.toolCallId);
		toolArgsByCallId.delete(event.toolCallId);
		if (event.name.trim() && firstTerminal && !runParams.isolatedCompletion && !loopbackOutcome && stripOpenClawMcpToolPrefix(event.name) === event.name) {
			const result = sanitizeToolResult(event.result);
			runAgentHarnessAfterToolCallHook({
				toolName: normalizeCliToolName(event.name),
				toolCallId: event.toolCallId,
				runId: runParams.runId,
				agentId: runParams.agentId,
				sessionId: runParams.sessionId,
				sessionKey: runParams.sessionKey,
				channelId: runParams.currentChannelId,
				startArgs: executedArgs ?? startedCall?.args ?? {},
				result,
				...event.isError ? { error: extractToolErrorMessage(result) ?? "CLI tool execution failed" } : {},
				startedAt: startedCall?.startedAt
			}).catch(() => {});
		}
		if (emitLiveEvents) {
			const strippedName = stripOpenClawMcpToolPrefix(event.name);
			const resultContentSource = tracked ? context.resultContentSourceByToolName?.get(strippedName) : void 0;
			const startedArgs = startedCall?.args;
			const planUpdate = tracked && startedCall?.tracked && !event.isError && (!loopbackOutcome || loopbackOutcome.outcome === "completed") && isAgentPlanProgressToolName(strippedName) ? projectProgressCardChannelUpdate(executedArgs ?? startedArgs) : void 0;
			if (planUpdate) emitAgentEvent({
				runId: runParams.runId,
				stream: "plan",
				data: {
					phase: "update",
					title: "Plan updated",
					source: "openclaw",
					...planUpdate
				}
			});
			emitToolEvent({
				phase: "result",
				name: event.name,
				toolCallId: event.toolCallId,
				isError: event.isError,
				result: sanitizeToolResult(event.result),
				...tracked && startedArgs ? { args: sanitizeToolArgs(startedArgs) } : {},
				...resultContentSource ? { resultContentSource } : {}
			}, { args: tracked ? executedArgs : startedArgs });
		}
	};
	const emitCliToolUseStart = (event) => emitToolUseStart(event, true);
	const emitCliToolResult = (event) => emitToolResult(event, true);
	const emitCliDisplayToolUseStart = (event) => emitToolUseStart(event, false);
	const emitCliDisplayToolResult = (event) => emitToolResult(event, false);
	const emitParsedToolUseStart = (event) => {
		const startedAt = Date.now();
		activeParsedTools.set(event.toolCallId, {
			startedAt,
			toolName: event.name,
			kind: event.kind
		});
		const diagnosticEvent = {
			type: "tool.execution.started",
			runId: runParams.runId,
			sessionId: runParams.sessionId,
			...runParams.sessionKey ? { sessionKey: runParams.sessionKey } : {},
			...runParams.agentId ? { agentId: runParams.agentId } : {},
			toolName: event.name,
			toolSource: resolveCliToolSource(event.name, event.kind),
			toolOwner: "cli-runner",
			toolCallId: event.toolCallId
		};
		const timeoutMs = context.managedMcpToolTimeoutMs;
		emitTrustedDiagnosticEvent(timeoutMs !== void 0 && event.name.startsWith("mcp__openclaw__") ? markToolExecutionLivenessDiagnosticEvent(diagnosticEvent, { deadlineAtMs: startedAt + timeoutMs }) : diagnosticEvent);
		emitCliToolUseStart(event);
	};
	const emitParsedToolTerminal = (event) => {
		const activeTool = activeParsedTools.get(event.toolCallId);
		activeParsedTools.delete(event.toolCallId);
		const trustedOutcome = params.toolTracking.resolveCliLoopbackTerminalOutcome(event.toolCallId);
		const toolName = activeTool?.toolName ?? event.name;
		const now = Date.now();
		const trustedTerminalReason = trustedOutcome && trustedOutcome.outcome !== "blocked" && trustedOutcome.outcome !== "completed" && trustedOutcome.outcome !== "unknown" ? trustedOutcome.outcome : void 0;
		const runState = params.getRunState();
		const terminalReason = trustedTerminalReason ?? resolveCliToolTerminalReason({
			error: event.incomplete ? runState.error : void 0,
			abortSignal: runParams.abortSignal
		});
		const useEnclosingTerminalReason = event.incomplete && runState.failed && activeTool !== void 0 && activeTool.kind !== "server_tool_use";
		const diagnosticBase = {
			runId: runParams.runId,
			sessionId: runParams.sessionId,
			...runParams.sessionKey ? { sessionKey: runParams.sessionKey } : {},
			...runParams.agentId ? { agentId: runParams.agentId } : {},
			toolName,
			toolSource: resolveCliToolSource(toolName, activeTool?.kind),
			toolOwner: "cli-runner",
			toolCallId: event.toolCallId,
			durationMs: Math.max(0, now - (activeTool?.startedAt ?? now))
		};
		if (trustedOutcome?.outcome === "unknown" && !useEnclosingTerminalReason || event.incomplete && activeTool?.kind === "server_tool_use" && !trustedOutcome) {
			emitTrustedDiagnosticEvent({
				type: "tool.execution.error",
				...diagnosticBase,
				errorCategory: "cli_tool_ambiguous",
				errorCode: "tool_outcome_unknown"
			});
			return;
		}
		const trustedFailure = trustedOutcome !== void 0 && trustedOutcome.outcome !== "completed";
		emitTrustedDiagnosticEvent(trustedOutcome?.outcome === "blocked" ? {
			type: "tool.execution.blocked",
			...diagnosticBase,
			deniedReason: trustedOutcome.deniedReason,
			reason: "blocked by before-tool policy"
		} : trustedFailure || !trustedOutcome && event.isError ? {
			type: "tool.execution.error",
			...diagnosticBase,
			errorCategory: terminalReason === "cancelled" ? "aborted" : event.incomplete && (!trustedOutcome || useEnclosingTerminalReason) ? "cli_tool_incomplete" : "cli_tool",
			terminalReason
		} : {
			type: "tool.execution.completed",
			...diagnosticBase
		});
	};
	const emitParsedToolResult = (event) => {
		emitParsedToolTerminal(event);
		emitCliToolResult(event);
	};
	const emitCliCompaction = (event) => {
		observedCliActivity = true;
		if (emitLiveEvents) emitAgentEvent({
			runId: runParams.runId,
			stream: "compaction",
			data: {
				...event,
				backend: context.backendResolved.id
			}
		});
	};
	const finalizeParsedTools = () => {
		for (const [toolCallId, activeTool] of Array.from(activeParsedTools)) emitParsedToolTerminal({
			toolCallId,
			name: activeTool.toolName,
			isError: true,
			incomplete: true
		});
	};
	const emitCliCommentaryText = (text) => {
		if (!emitLiveEvents) return;
		commentaryCounter += 1;
		emitAgentEvent({
			runId: runParams.runId,
			stream: "item",
			data: {
				kind: "preamble",
				itemId: `commentary-${runParams.runId}-${commentaryCounter}`,
				phase: "end",
				title: "commentary",
				status: "running",
				progressText: applyPluginTextReplacements(text, context.backendResolved.textTransforms?.output)
			}
		});
	};
	const emitCliAssistantDelta = ({ text, delta }) => {
		if (text || delta) {
			observedCliActivity = true;
			if (!signaledAssistantOutputStarted) {
				signaledAssistantOutputStarted = true;
				runParams.onExecutionPhase?.({
					phase: "assistant_output_started",
					provider: runParams.provider,
					model: context.modelId,
					backend: context.backendResolved.id
				});
			}
		}
		if (emitLiveEvents) emitAgentEvent({
			runId: runParams.runId,
			stream: "assistant",
			data: {
				text: applyPluginTextReplacements(text, context.backendResolved.textTransforms?.output),
				delta: applyPluginTextReplacements(delta, context.backendResolved.textTransforms?.output)
			}
		});
	};
	const emitCliCompletedReply = (text, assistantMessageIndex) => {
		if (text) observedCliActivity = true;
		if (emitLiveEvents) emitAgentEvent({
			runId: runParams.runId,
			stream: "assistant",
			data: {
				assistantMessageIndex,
				completedText: applyPluginTextReplacements(text, context.backendResolved.textTransforms?.output)
			}
		});
	};
	const emitCliThinkingDelta = ({ text, delta, isReasoningSnapshot }) => {
		if (text || delta) observedCliActivity = true;
		if (emitLiveEvents) emitAgentEvent({
			runId: runParams.runId,
			stream: "thinking",
			data: {
				text,
				delta,
				...isReasoningSnapshot ? { isReasoningSnapshot } : {}
			}
		});
	};
	const emitCliThinkingProgress = ({ progressTokens }) => {
		observedCliActivity = true;
		if (emitLiveEvents) emitAgentEvent({
			runId: runParams.runId,
			stream: "thinking",
			data: { progressTokens }
		});
	};
	return {
		emitLiveEvents,
		emitCliToolUseStart,
		emitCliToolResult,
		emitCliDisplayToolUseStart,
		emitCliDisplayToolResult,
		emitParsedToolUseStart,
		emitParsedToolResult,
		emitCliCompaction,
		finalizeParsedTools,
		emitCliCommentaryText,
		emitCliAssistantDelta,
		emitCliCompletedReply,
		emitCliThinkingDelta,
		emitCliThinkingProgress,
		hasObservedCliActivity: () => observedCliActivity,
		activeParsedToolCount: () => activeParsedTools.size,
		getToolSummary
	};
}
//#endregion
//#region src/agents/cli-runner/execute-logging.ts
function buildCliLogArgs(params) {
	const logArgs = [];
	for (let i = 0; i < params.args.length; i += 1) {
		const arg = params.args[i] ?? "";
		if (arg === params.systemPromptArg) {
			const systemPromptValue = params.args[i + 1] ?? "";
			logArgs.push(arg, `<systemPrompt:${systemPromptValue.length} chars>`);
			i += 1;
			continue;
		}
		if (arg === params.modelArg) {
			logArgs.push(arg, params.args[i + 1] ?? "");
			i += 1;
			continue;
		}
		if (arg === params.imageArg) {
			logArgs.push(arg, "<image>");
			i += 1;
			continue;
		}
		logArgs.push(arg);
	}
	if (params.argsPrompt) {
		const promptIndex = logArgs.indexOf(params.argsPrompt);
		if (promptIndex >= 0) logArgs[promptIndex] = `<prompt:${params.argsPrompt.length} chars>`;
	}
	return logArgs;
}
const CLI_ENV_AUTH_LOG_KEYS = [
	"AI_GATEWAY_API_KEY",
	"ANTHROPIC_API_KEY",
	"ANTHROPIC_API_KEY_OLD",
	"ANTHROPIC_API_TOKEN",
	"ANTHROPIC_AUTH_TOKEN",
	"ANTHROPIC_BASE_URL",
	"ANTHROPIC_CUSTOM_HEADERS",
	"ANTHROPIC_OAUTH_TOKEN",
	"ANTHROPIC_UNIX_SOCKET",
	"AZURE_OPENAI_API_KEY",
	"CLAUDE_CODE_OAUTH_TOKEN",
	"CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST",
	"OPENAI_API_KEY",
	"OPENAI_STEIPETE_API_KEY",
	"OPENROUTER_API_KEY"
];
const CLI_ENV_RUNTIME_LOG_KEYS = ["GEMINI_CLI_HOME", "GEMINI_CLI_SYSTEM_SETTINGS_PATH"];
const CLAUDE_SELECTED_AUTH_ENV_KEYS = /* @__PURE__ */ new Set(["ANTHROPIC_API_KEY", "CLAUDE_CODE_OAUTH_TOKEN"]);
const NODE_CLAUDE_FORWARD_ENV_KEYS = /* @__PURE__ */ new Set(["CLAUDE_CODE_AUTO_COMPACT_WINDOW", "CLAUDE_CODE_DISABLE_1M_CONTEXT"]);
function resolveNodeClaudeAuthEnv(context) {
	const secretInput = context.preparedBackend.secretInput;
	if (!secretInput) return {};
	const descriptorEnv = context.preparedBackend.env ?? {};
	const requestEnv = Object.hasOwn(descriptorEnv, "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR") ? "CLAUDE_CODE_OAUTH_TOKEN" : Object.hasOwn(descriptorEnv, "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR") ? "ANTHROPIC_API_KEY" : void 0;
	if (!requestEnv) return {};
	const data = secretInput.createData();
	try {
		return { [requestEnv]: data.toString("utf8") };
	} finally {
		data.fill(0);
	}
}
const CLI_BACKEND_PRESERVE_ENV = "OPENCLAW_LIVE_CLI_BACKEND_PRESERVE_ENV";
function parseCliBackendPreserveEnv(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return /* @__PURE__ */ new Set();
	if (trimmed.startsWith("[")) try {
		const parsed = JSON.parse(trimmed);
		return new Set(Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : []);
	} catch {
		return /* @__PURE__ */ new Set();
	}
	return new Set(trimmed.split(/[,\s]+/).map((entry) => entry.trim()).filter((entry) => entry.length > 0));
}
function listPresentCliEnvKeys(env, keys) {
	return keys.filter((key) => {
		const value = env[key];
		return typeof value === "string" && value.length > 0;
	});
}
function formatCliEnvKeyList(keys) {
	return keys.length > 0 ? keys.join(",") : "none";
}
function buildCliEnvMcpLog(childEnv) {
	return [`token=${childEnv.OPENCLAW_MCP_TOKEN ? "set" : "missing"}`, `capture=${childEnv.OPENCLAW_MCP_CLI_CAPTURE_KEY ? "set" : "missing"}`].join(" ");
}
function fingerprintCliSessionId(sessionId) {
	const trimmed = sessionId?.trim();
	if (!trimmed) return "none";
	return crypto.createHash("sha256").update(trimmed).digest("hex").slice(0, 12);
}
function formatCliSessionReuseLogState(reusableSession) {
	switch (reusableSession.mode) {
		case "reuse": return "reusable";
		case "reuse-with-drift": return `reusable-drift:${reusableSession.drift.reasons.join(",")}`;
		case "invalidate": return `invalidated:${reusableSession.invalidatedReason}`;
		case "none": return "none";
	}
	return reusableSession;
}
/** Builds the compact execution summary logged before a CLI backend run. */
function buildCliExecLogLine(params) {
	return [
		`cli exec: provider=${params.provider}`,
		`model=${params.model}`,
		`promptChars=${params.promptChars}`,
		`trigger=${params.trigger ?? "unknown"}`,
		`useResume=${params.useResume ? "true" : "false"}`,
		`session=${params.cliSessionId ? "present" : "none"}`,
		`resumeSession=${params.useResume ? fingerprintCliSessionId(params.resolvedSessionId) : "none"}`,
		`reuse=${formatCliSessionReuseLogState(params.reusableSession)}`,
		`historyPrompt=${params.hasHistoryPrompt ? "present" : "none"}`
	].join(" ");
}
/** Summarizes auth-related env keys preserved or cleared for a CLI child process. */
function buildCliEnvAuthLog(childEnv) {
	const hostKeys = listPresentCliEnvKeys(process.env, CLI_ENV_AUTH_LOG_KEYS);
	const childKeys = listPresentCliEnvKeys(childEnv, CLI_ENV_AUTH_LOG_KEYS);
	const childKeySet = new Set(childKeys);
	const clearedKeys = hostKeys.filter((key) => !childKeySet.has(key));
	const runtimeHostKeys = listPresentCliEnvKeys(process.env, CLI_ENV_RUNTIME_LOG_KEYS);
	const runtimeChildKeys = listPresentCliEnvKeys(childEnv, CLI_ENV_RUNTIME_LOG_KEYS);
	const runtimeChildKeySet = new Set(runtimeChildKeys);
	const runtimeClearedKeys = runtimeHostKeys.filter((key) => !runtimeChildKeySet.has(key));
	return [
		`host=${formatCliEnvKeyList(hostKeys)}`,
		`child=${formatCliEnvKeyList(childKeys)}`,
		`cleared=${formatCliEnvKeyList(clearedKeys)}`,
		`runtimeHost=${formatCliEnvKeyList(runtimeHostKeys)}`,
		`runtimeChild=${formatCliEnvKeyList(runtimeChildKeys)}`,
		`runtimeCleared=${formatCliEnvKeyList(runtimeClearedKeys)}`
	].join(" ");
}
function logCliInvocation(params) {
	const logArgs = buildCliLogArgs(params);
	params.log(`cli argv: ${params.command} ${logArgs.join(" ")}`);
	params.log(`cli env auth: ${buildCliEnvAuthLog(params.env)}`);
	if (params.env.OPENCLAW_MCP_TOKEN) params.log(`cli env mcp: ${buildCliEnvMcpLog(params.env)}`);
}
//#endregion
//#region src/agents/cli-runner/execute-node-claude.ts
const NODE_CLI_MAX_TIMEOUT_MS = 864e5;
const NODE_CLI_MAX_IDLE_TIMEOUT_MS = 18e5;
const NODE_CLI_OMIT_BARE_ARGS = /* @__PURE__ */ new Set(["--strict-mcp-config", "--exclude-dynamic-system-prompt-sections"]);
const NODE_CLI_OMIT_VALUE_ARGS = /* @__PURE__ */ new Set([
	"--permission-mode",
	"--plugin-dir",
	"--plugin-dir-no-mcp"
]);
const NODE_CLI_OMIT_VARIADIC_ARGS = /* @__PURE__ */ new Set([
	"--mcp-config",
	"--allowedTools",
	"--allowed-tools"
]);
/** Remove Gateway-local file, plugin, MCP, and allow-list arguments. */
function stripGatewayLocalClaudeArgs(args) {
	const result = [];
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index] ?? "";
		const equalsIndex = arg.indexOf("=");
		const name = equalsIndex > 0 ? arg.slice(0, equalsIndex) : arg;
		if (NODE_CLI_OMIT_BARE_ARGS.has(name)) continue;
		if (NODE_CLI_OMIT_VALUE_ARGS.has(name)) {
			if (equalsIndex < 0) index += 1;
			continue;
		}
		if (NODE_CLI_OMIT_VARIADIC_ARGS.has(name)) {
			if (equalsIndex < 0) while (typeof args[index + 1] === "string" && !args[index + 1]?.startsWith("-")) index += 1;
			continue;
		}
		result.push(arg);
	}
	return result;
}
function parseNodeClaudeResultPayload(result) {
	const value = result.payloadJSON ? JSON.parse(result.payloadJSON) : result.payload;
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("paired node returned an invalid Claude CLI result");
	const record = value;
	if (!Number.isInteger(record.exitCode) || typeof record.stderrTail !== "string" || typeof record.truncated !== "boolean" || record.timeoutKind !== void 0 && record.timeoutKind !== "hard" && record.timeoutKind !== "idle") throw new Error("paired node returned an invalid Claude CLI result");
	return {
		exitCode: record.exitCode,
		stderrTail: record.stderrTail,
		truncated: record.truncated,
		...record.timeoutKind ? { timeoutKind: record.timeoutKind } : {}
	};
}
function parseNodeClaudeApprovalRequired(result) {
	if (!result.ok) return null;
	const value = result.payloadJSON ? JSON.parse(result.payloadJSON) : result.payload;
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const record = value;
	if (record.approvalRequired !== true || !record.systemRunPlan || typeof record.systemRunPlan !== "object" || Array.isArray(record.systemRunPlan) || record.security !== "deny" && record.security !== "allowlist" && record.security !== "full" || record.ask !== "off" && record.ask !== "on-miss" && record.ask !== "always") return null;
	return {
		systemRunPlan: record.systemRunPlan,
		security: record.security,
		ask: record.ask
	};
}
function createCliAbortError() {
	return createAbortError("CLI run aborted");
}
async function waitForNodeOperation(params) {
	if (!params.signal) return await params.operation;
	if (params.signal.aborted) throw createCliAbortError();
	return await new Promise((resolve, reject) => {
		const onAbort = () => reject(createCliAbortError());
		params.signal?.addEventListener("abort", onAbort, { once: true });
		params.operation.then(resolve, reject).finally(() => {
			params.signal?.removeEventListener("abort", onAbort);
		});
	});
}
async function executeNodeClaudeRun(params) {
	const contextParams = params.context.params;
	const startedAt = Date.now();
	const hardTimeoutMs = Math.min(contextParams.timeoutMs, NODE_CLI_MAX_TIMEOUT_MS);
	const hardDeadlineAt = startedAt + hardTimeoutMs;
	const nodeAbortController = new AbortController();
	const nodeRunAbortSignal = nodeAbortController.signal;
	const assertCurrent = createCliRunCurrentAssertion(contextParams, nodeRunAbortSignal);
	let hardDeadlineReached = false;
	const hardDeadlineTimer = setTimeout(() => {
		hardDeadlineReached = true;
		nodeAbortController.abort();
	}, hardTimeoutMs);
	const abortNodeRun = () => nodeAbortController.abort();
	contextParams.abortSignal?.addEventListener("abort", abortNodeRun, { once: true });
	if (contextParams.abortSignal?.aborted) abortNodeRun();
	const replyBackendHandle = contextParams.replyOperation ? {
		kind: "cli",
		runId: contextParams.runId,
		toolAuthorityFingerprint: contextParams.toolAuthorityFingerprint,
		terminalReplyExpectation: resolveReplyExpectation(contextParams),
		cancel: abortNodeRun
	} : void 0;
	if (replyBackendHandle) contextParams.replyOperation?.attachBackend(replyBackendHandle);
	let nodeResult;
	let skillRuntime;
	try {
		assertCurrent();
		skillRuntime = await prepareNodeClaudeSkillRuntime(params.context, nodeRunAbortSignal);
		const invokeNode = async (approval) => {
			const remainingTimeoutMs = hardDeadlineAt - Date.now();
			if (remainingTimeoutMs <= 0) {
				hardDeadlineReached = true;
				nodeAbortController.abort();
				return {
					ok: false,
					error: {
						code: "TIMEOUT",
						message: "paired-node Claude CLI invocation exceeded its hard timeout"
					}
				};
			}
			assertCurrent();
			return await params.deps.invokeNodeClaudeCliRun({
				assertCurrent,
				nodeId: params.nodePlacement.nodeId,
				argv: params.executionArgs,
				stdin: params.stdinPayload,
				...params.nodePlacement.cwd ? { cwd: params.nodePlacement.cwd } : {},
				...params.nodeSystemPrompt !== void 0 ? { systemPrompt: params.nodeSystemPrompt } : {},
				...params.nodeEnv ? { env: params.nodeEnv } : {},
				...params.nodeClearEnv ? { clearEnv: params.nodeClearEnv } : {},
				...contextParams.agentId ? { agentId: contextParams.agentId } : {},
				...contextParams.sessionKey ? { sessionKey: contextParams.sessionKey } : {},
				...approval ? {
					approvalDecision: approval.decision,
					systemRunPlan: approval.plan
				} : {},
				timeoutMs: remainingTimeoutMs,
				idleTimeoutMs: Math.max(1e3, Math.min(params.noOutputTimeoutMs, NODE_CLI_MAX_IDLE_TIMEOUT_MS)),
				onProgress: params.consumeStdout,
				signal: skillRuntime?.signal ?? nodeAbortController.signal,
				...skillRuntime ? { skillRuntime } : {}
			});
		};
		nodeResult = await invokeNode();
		const approval = parseNodeClaudeApprovalRequired(nodeResult);
		if (approval) {
			skillRuntime?.assertCurrent();
			const approvalId = crypto.randomUUID();
			const registration = await waitForNodeOperation({
				operation: params.deps.registerExecApprovalRequestForHostOrThrow({
					approvalId,
					command: approval.systemRunPlan.commandText,
					commandArgv: approval.systemRunPlan.argv,
					systemRunPlan: approval.systemRunPlan,
					workdir: approval.systemRunPlan.cwd ?? void 0,
					host: "node",
					nodeId: params.nodePlacement.nodeId,
					security: approval.security,
					ask: approval.ask,
					unavailableDecisions: ["allow-always"],
					agentId: contextParams.agentId,
					sessionKey: contextParams.sessionKey,
					...contextParams.approvalReviewerDeviceId ? { approvalReviewerDeviceIds: [contextParams.approvalReviewerDeviceId] } : {}
				}),
				signal: skillRuntime?.signal ?? nodeAbortController.signal
			});
			const decision = await waitForNodeOperation({
				operation: params.deps.resolveRegisteredExecApprovalDecision({
					approvalId: registration.id,
					preResolvedDecision: registration.finalDecision
				}),
				signal: skillRuntime?.signal ?? nodeAbortController.signal
			});
			if (decision === "allow-once" || decision === "allow-always") nodeResult = await invokeNode({
				decision,
				plan: approval.systemRunPlan
			});
			else nodeResult = {
				ok: false,
				error: {
					code: "PERMISSION_DENIED",
					message: "paired-node Claude CLI agent run was not approved"
				}
			};
		}
	} catch (error) {
		if (!hardDeadlineReached) throw error;
		nodeResult = {
			ok: false,
			error: {
				code: "TIMEOUT",
				message: "paired-node Claude CLI invocation exceeded its hard timeout"
			}
		};
	} finally {
		if (skillRuntime?.signal.aborted) nodeAbortController.abort();
		skillRuntime?.close();
		clearTimeout(hardDeadlineTimer);
		if (replyBackendHandle) contextParams.replyOperation?.detachBackend(replyBackendHandle);
		contextParams.abortSignal?.removeEventListener("abort", abortNodeRun);
	}
	if (hardDeadlineReached) nodeResult = {
		ok: false,
		error: {
			code: "TIMEOUT",
			message: "paired-node Claude CLI invocation exceeded its hard timeout"
		}
	};
	if (!nodeResult.ok) {
		const code = nodeResult.error?.code;
		const timedOut = code === "TIMEOUT" || code === "IDLE_TIMEOUT";
		const result = {
			reason: code === "IDLE_TIMEOUT" ? "no-output-timeout" : code === "TIMEOUT" ? "overall-timeout" : code === "ABORTED" ? "manual-cancel" : "exit",
			exitCode: timedOut || code === "ABORTED" ? null : 1,
			exitSignal: null,
			durationMs: Date.now() - startedAt,
			stdout: "",
			stderr: nodeResult.error?.message ?? "paired-node Claude CLI invocation failed",
			timedOut,
			noOutputTimedOut: code === "IDLE_TIMEOUT"
		};
		params.consumeStderr(result.stderr);
		return {
			result,
			nodeRunAbortSignal,
			nodeRunTruncated: false
		};
	}
	const payload = parseNodeClaudeResultPayload(nodeResult);
	if (payload.stderrTail) params.consumeStderr(payload.stderrTail);
	return {
		result: {
			reason: payload.timeoutKind === "idle" ? "no-output-timeout" : payload.timeoutKind === "hard" ? "overall-timeout" : "exit",
			exitCode: payload.timeoutKind ? null : payload.exitCode,
			exitSignal: null,
			durationMs: Date.now() - startedAt,
			stdout: "",
			stderr: payload.stderrTail,
			timedOut: payload.timeoutKind !== void 0,
			noOutputTimedOut: payload.timeoutKind === "idle"
		},
		nodeRunAbortSignal,
		nodeRunTruncated: payload.truncated
	};
}
//#endregion
//#region src/agents/cli-runner/execute-output-buffer.ts
const CLI_RUNNER_OUTPUT_TAIL_BYTES = 65536;
function appendCliOutputTail(tail, chunk) {
	return truncateUtf8Suffix(`${tail}${chunk}`, CLI_RUNNER_OUTPUT_TAIL_BYTES);
}
//#endregion
//#region src/agents/cli-runner/cli-native-tool-approval.ts
const CLI_NATIVE_TOOL_DESCRIPTION_HEAD_CHARS = 300;
const CLI_NATIVE_TOOL_DESCRIPTION_TAIL_CHARS = 80;
const CLI_NATIVE_TOOL_DESCRIPTION_MAX_CHARS = 380;
const CLI_NATIVE_TOOL_APPROVAL_GATEWAY_GRACE_MS = 1e4;
const CLI_NATIVE_TOOL_ARBITRARY_EXECUTION_TOOL = "Bash";
function resolveCliNativeToolApprovalPlan(execPermission) {
	if (execPermission.security === "deny") return "deny";
	if (execPermission.ask === "off") return execPermission.security === "full" ? "allow" : "deny";
	return "prompt";
}
/**
* The gateway caps approval descriptions (PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH),
* so full inputs cannot ride this channel. Head+tail display defeats padded
* prefixes hiding an executable tail, and the quantified marker makes a partial
* view an explicit operator decision. Accepted tradeoff: the middle stays
* unreviewable; oversized inputs therefore never earn allow-always.
*/
function formatCliNativeToolDescription(toolInput) {
	const compact = JSON.stringify(toolInput) ?? "{}";
	if (compact.length <= CLI_NATIVE_TOOL_DESCRIPTION_MAX_CHARS) return {
		compact,
		text: compact,
		truncated: false
	};
	const head = truncateUtf16Safe(compact, CLI_NATIVE_TOOL_DESCRIPTION_HEAD_CHARS);
	const tail = sliceUtf16Safe(compact, compact.length - CLI_NATIVE_TOOL_DESCRIPTION_TAIL_CHARS);
	return {
		compact,
		text: `${head} …[+${compact.length - head.length - tail.length} chars hidden]… ${tail}`,
		truncated: true
	};
}
async function requestCliNativeToolApproval(params) {
	try {
		const timeoutMs = DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS;
		const gatewayTimeoutMs = addTimerTimeoutGraceMs(timeoutMs, CLI_NATIVE_TOOL_APPROVAL_GATEWAY_GRACE_MS) ?? timeoutMs + CLI_NATIVE_TOOL_APPROVAL_GATEWAY_GRACE_MS;
		const description = formatCliNativeToolDescription(params.toolInput);
		const summarySanitization = params.toolName === CLI_NATIVE_TOOL_ARBITRARY_EXECUTION_TOOL ? sanitizeExecApprovalWarningTextWithStatus(description.text) : null;
		if (params.toolName === CLI_NATIVE_TOOL_ARBITRARY_EXECUTION_TOOL && (description.truncated || summarySanitization?.truncated === true || summarySanitization?.oversized === true || summarySanitization && exceedsApprovalTextLimit(summarySanitization.text, 512))) return {
			kind: "deny",
			reason: "policy-oversized"
		};
		const bashCommand = params.toolName === CLI_NATIVE_TOOL_ARBITRARY_EXECUTION_TOOL && typeof params.toolInput.command === "string" ? params.toolInput.command : void 0;
		let autoAllow;
		if (params.ask === "on-miss" && params.pluginId === "claude-cli" && bashCommand && params.agentId) {
			const file = loadExecApprovals();
			const { allowlist } = resolveExecApprovalsFromFile({
				file,
				agentId: params.agentId
			});
			const analysis = await evaluateShellAllowlistWithAuthorization({
				command: bashCommand,
				allowlist,
				safeBins: /* @__PURE__ */ new Set(),
				cwd: params.cwd,
				env: params.env
			});
			const plan = analysis.authorizationPlan;
			const candidates = plan?.groups.flatMap((group) => group.candidates) ?? [];
			const miss = candidates.findIndex((candidate, index) => candidate.transport.kind !== "direct" || candidate.trustMode !== "executable" || !candidate.sourceSegment.resolution?.execution.resolvedPath || candidate.sourceSegment.resolution.wrapperChain?.length || analysis.segmentSatisfiedBy[index] !== "allowlist");
			const rendered = plan?.ok && params.cwd && candidates.length > 0 && miss === -1 ? buildAuthorizedShellCommandFromPlan({
				plan,
				mode: "enforced",
				segmentSatisfiedBy: analysis.segmentSatisfiedBy
			}) : {
				ok: false,
				reason: plan && !plan.ok ? plan.reason : candidates[miss]?.sourceStep.text ?? "no classified executable"
			};
			if (rendered.ok) autoAllow = () => {
				params.abortSignal?.throwIfAborted();
				params.assertActive?.();
				recordAllowlistMatchesUse({
					approvals: file,
					agentId: params.agentId,
					matches: analysis.allowlistMatches,
					command: bashCommand,
					resolvedPath: candidates[0]?.sourceSegment.resolution?.execution.resolvedPath ?? void 0,
					authorization: {
						source: "current-policy",
						security: "allowlist",
						ask: params.ask,
						allowlistSatisfied: true
					}
				});
				logVerbose("Claude CLI native Bash auto-allowed via exec allowlist");
				return {
					kind: "allow",
					grantAlways: false,
					updatedInput: {
						...params.toolInput,
						command: rendered.command
					}
				};
			};
			else {
				const reason = sanitizeExecApprovalWarningTextWithStatus(rendered.reason).text;
				description.text += `\nExec allowlist miss: ${truncateUtf16Safe(reason, 100)}`;
			}
		}
		let mutableFileBinding;
		if (params.toolName === CLI_NATIVE_TOOL_ARBITRARY_EXECUTION_TOOL) {
			const prepared = await prepareSystemRunMutableFileBinding({
				command: {
					kind: "shell",
					text: bashCommand ?? ""
				},
				cwd: params.cwd ?? params.fallbackCwd,
				env: autoAllow ? params.env : params.bindingEnv ?? params.env
			});
			if (!prepared.ok) {
				const message = prepared.reason === "unsupported-command-shape" ? `${prepared.message}\nNo approval request was created for this attempt; this is not a user denial. Retry a supported direct executable/script command with explicit paths through the normal approval flow.` : prepared.message;
				return {
					kind: "deny",
					reason: "operand-binding",
					message: sanitizeExecApprovalWarningTextWithStatus(`${message}\n${description.text}`).text
				};
			}
			mutableFileBinding = prepared.binding.operands.length > 0 ? prepared.binding : void 0;
		}
		if (autoAllow) return autoAllow();
		if (bashCommand && exceedsApprovalTextLimit(sanitizeExecApprovalWarningTextWithStatus(description.text).text, 512)) return {
			kind: "deny",
			reason: "policy-oversized"
		};
		const allowedDecisions = params.ask === "always" || params.toolName === CLI_NATIVE_TOOL_ARBITRARY_EXECUTION_TOOL || description.truncated ? ["allow-once", "deny"] : [
			"allow-once",
			"allow-always",
			"deny"
		];
		const requestResult = await racePromiseWithAbortSignal(callGatewayTool("plugin.approval.request", { timeoutMs: gatewayTimeoutMs }, {
			pluginId: params.pluginId,
			toolName: params.toolName,
			toolCallId: params.toolCallId,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			title: truncateUtf16Safe(`${params.pluginId} native tool: ${params.toolName}`, 80),
			description: description.text,
			detail: truncatePluginApprovalDetail(description.compact),
			severity: "warning",
			allowedDecisions,
			timeoutMs,
			twoPhase: true
		}, {
			expectFinal: false,
			signal: params.abortSignal
		}), params.abortSignal);
		const id = typeof requestResult?.id === "string" ? requestResult.id : "";
		if (!id) return {
			kind: "deny",
			reason: "unavailable"
		};
		let decision;
		if (Object.hasOwn(requestResult ?? {}, "decision")) decision = requestResult.decision;
		else {
			const waitResult = await racePromiseWithAbortSignal(callGatewayTool("plugin.approval.waitDecision", { timeoutMs: gatewayTimeoutMs }, { id }, { signal: params.abortSignal }), params.abortSignal);
			decision = waitResult?.id === id ? waitResult.decision : void 0;
		}
		if (params.abortSignal?.aborted) return {
			kind: "deny",
			reason: "unavailable"
		};
		if ((decision === "allow-once" || decision === "allow-always") && mutableFileBinding) {
			const binding = await revalidateSystemRunMutableFileBinding({
				binding: mutableFileBinding,
				cwd: params.cwd ?? params.fallbackCwd
			});
			if (!binding.ok) return {
				kind: "deny",
				reason: "operand-binding",
				message: binding.message
			};
		}
		if (decision === "allow-once" || decision === "allow-always" && allowedDecisions.includes(decision)) return {
			kind: "allow",
			grantAlways: decision === "allow-always"
		};
		return {
			kind: "deny",
			reason: decision === "deny" ? "user" : "unavailable"
		};
	} catch {
		return {
			kind: "deny",
			reason: "unavailable"
		};
	}
}
//#endregion
//#region src/agents/cli-runner/execute-plugin.ts
const PLUGIN_ITERATOR_CLOSE_TIMEOUT_MS = 5e3;
function denyTool(message) {
	return {
		behavior: "deny",
		message
	};
}
function createPluginToolPermissionHandler(params) {
	const run = params.context.params;
	const permission = resolveExecDefaults({
		cfg: run.config,
		sessionEntry: run.sessionEntry,
		execOverrides: run.execOverrides,
		agentId: run.agentId,
		sessionKey: run.runtimePolicySessionKey ?? run.sessionKey
	});
	const grants = /* @__PURE__ */ new Set();
	return async (request) => {
		const signal = request.abortSignal ? AbortSignal.any([params.abortSignal, request.abortSignal]) : params.abortSignal;
		const assertActive = createCliRunCurrentAssertion(run, signal);
		try {
			assertActive();
		} catch {
			return denyTool("OpenClaw denied native tool use: the admitted run is no longer active.");
		}
		const toolName = request.toolName.trim();
		if (!toolName) return denyTool("OpenClaw denied an unnamed native tool.");
		if (run.cliToolAvailability && !run.cliToolAvailability.native.includes(toolName)) return denyTool(`OpenClaw denied native tool ${toolName}: it is unavailable to this run.`);
		const canonicalToolName = normalizeCliToolName(toolName);
		const nativeFileTool = [
			"read",
			"write",
			"edit"
		].includes(canonicalToolName) && Object.hasOwn(request.toolInput, "file_path");
		let policyInput = request.toolInput;
		if (nativeFileTool) {
			const nativePath = request.toolInput.file_path;
			if (typeof nativePath !== "string") return denyTool("OpenClaw denied native file tool use: invalid file path.");
			if (Object.hasOwn(request.toolInput, "path") && request.toolInput.path !== nativePath) return denyTool("OpenClaw denied native file tool use: conflicting file paths.");
			policyInput = {
				...request.toolInput,
				path: nativePath
			};
			if (canonicalToolName === "edit") {
				const { old_string: oldText, new_string: newText, edits } = request.toolInput;
				if (typeof oldText !== "string" || typeof newText !== "string") return denyTool("OpenClaw denied native edit tool use: invalid replacement.");
				if (edits !== void 0 && (!Array.isArray(edits) || edits.length !== 1 || !isRecord(edits[0]) || edits[0].oldText !== oldText || edits[0].newText !== newText)) return denyTool("OpenClaw denied native edit tool use: conflicting replacements.");
				policyInput.edits = [{
					oldText,
					newText
				}];
			}
		}
		const requester = {
			...run.messageChannel ?? run.messageProvider ? { channel: run.messageChannel ?? run.messageProvider } : {},
			...run.agentAccountId ? { accountId: run.agentAccountId } : {},
			...run.senderId ? { senderId: run.senderId } : {},
			...run.senderIsOwner !== void 0 ? { senderIsOwner: run.senderIsOwner } : {}
		};
		const hookResult = await runBeforeToolCallHook({
			toolName: canonicalToolName,
			params: policyInput,
			...request.toolCallId ? { toolCallId: request.toolCallId } : {},
			signal,
			ctx: {
				...run.agentId ? { agentId: run.agentId } : {},
				...run.config ? { config: run.config } : {},
				cwd: params.context.cwd ?? params.context.workspaceDir,
				workspaceDir: params.context.workspaceDir,
				...run.sessionKey ? { sessionKey: run.sessionKey } : {},
				sessionId: run.sessionId,
				runId: run.runId,
				...run.trigger ? { trigger: run.trigger } : {},
				...run.approvalReviewerDeviceId ? { approvalReviewerDeviceId: run.approvalReviewerDeviceId } : {},
				...run.currentChannelId ? { channelId: run.currentChannelId } : {},
				...Object.keys(requester).length > 0 ? { requester } : {},
				turnSourceChannel: run.messageChannel ?? run.messageProvider,
				turnSourceTo: run.chatId ?? run.currentChannelId,
				turnSourceAccountId: run.agentAccountId,
				turnSourceThreadId: run.currentThreadTs,
				loopDetection: resolveToolLoopDetectionConfig({
					cfg: run.config,
					agentId: run.agentId
				})
			}
		});
		try {
			assertActive();
		} catch {
			return denyTool("OpenClaw denied native tool use: the admitted run closed during policy.");
		}
		if (hookResult.blocked) return denyTool(hookResult.reason);
		if (!isRecord(hookResult.params)) return denyTool("OpenClaw denied native tool use: before_tool_call returned invalid input.");
		let toolInput = hookResult.params;
		if (nativeFileTool) {
			if (typeof toolInput.path !== "string") return denyTool("OpenClaw denied native file tool use: invalid rewritten file path.");
			if (toolInput === policyInput) toolInput = request.toolInput;
			else {
				toolInput = {
					...toolInput,
					file_path: toolInput.path
				};
				if (!Object.hasOwn(request.toolInput, "path")) delete toolInput.path;
				if (canonicalToolName === "edit") {
					const edits = toolInput.edits;
					if (!Array.isArray(edits) || edits.length !== 1 || !isRecord(edits[0]) || typeof edits[0].oldText !== "string" || typeof edits[0].newText !== "string") return denyTool("OpenClaw denied an unrepresentable native edit rewrite.");
					toolInput.old_string = edits[0].oldText;
					toolInput.new_string = edits[0].newText;
					if (!Object.hasOwn(request.toolInput, "edits")) delete toolInput.edits;
				}
			}
		}
		const plan = resolveCliNativeToolApprovalPlan(permission);
		if (plan === "deny") return denyTool(`OpenClaw exec policy denied native tool use (security=${permission.security}, ask=${permission.ask}).`);
		const currentGrants = getCliLiveSessionApprovalGrants(params.context) ?? grants;
		if (plan === "allow" || permission.ask !== "always" && currentGrants.has(toolName)) {
			assertActive();
			recordAdjustedParamsForToolCall(request.toolCallId, toolInput, run.runId);
			return {
				behavior: "allow",
				updatedInput: toolInput
			};
		}
		params.onPendingApproval(1);
		let outcome;
		try {
			outcome = await requestCliNativeToolApproval({
				toolName,
				toolInput,
				pluginId: params.context.backendResolved.id,
				sessionKey: run.sessionKey,
				agentId: run.agentId,
				toolCallId: request.toolCallId,
				cwd: request.cwd,
				fallbackCwd: params.context.cwd ?? params.context.workspaceDir,
				bindingEnv: params.env,
				env: {
					...params.env,
					PATH: mergePathPrepend(params.env.PATH, resolveExecToolConfig({
						cfg: run.config,
						agentId: run.agentId
					}).pathPrepend ?? [])
				},
				assertActive,
				abortSignal: signal,
				ask: permission.ask
			});
		} finally {
			params.onPendingApproval(-1);
		}
		try {
			assertActive();
		} catch {
			return denyTool("OpenClaw denied native tool use: the admitted run closed during approval.");
		}
		if (outcome.kind !== "allow") return denyTool(outcome.message ?? (outcome.reason === "user" ? `OpenClaw user denied native tool use (${toolName}).` : `OpenClaw approval was not granted for native tool use (${toolName}).`));
		if (outcome.grantAlways) currentGrants.add(toolName);
		const updatedInput = outcome.updatedInput ?? toolInput;
		recordAdjustedParamsForToolCall(request.toolCallId, updatedInput, run.runId);
		return {
			behavior: "allow",
			updatedInput
		};
	};
}
function cancelUserInput(message) {
	return {
		status: "cancelled",
		message
	};
}
function createPluginUserInputHandler(params) {
	const run = params.context.params;
	return async (request) => {
		const signal = request.abortSignal ? AbortSignal.any([params.abortSignal, request.abortSignal]) : params.abortSignal;
		const assertActive = createCliRunCurrentAssertion(run, signal);
		try {
			assertActive();
		} catch {
			return cancelUserInput("OpenClaw cancelled operator input: the admitted run is no longer active.");
		}
		const toolName = request.toolName.trim();
		if (!toolName || run.cliToolAvailability && !run.cliToolAvailability.native.includes(toolName)) return cancelUserInput(toolName ? `OpenClaw cancelled operator input from ${toolName}: it is unavailable to this run.` : "OpenClaw cancelled an unnamed operator input request.");
		if (request.questions.length === 0 || request.questions.length > 12) return cancelUserInput("OpenClaw cancelled an invalid operator input request.");
		const questionAuthority = params.context.bindQuestionAnswerAuthority?.(assertActive);
		const assertQuestionActive = () => {
			assertActive();
			questionAuthority?.assertActive();
		};
		params.onPendingInput(1);
		try {
			const result = await withAgentQuestionAnswerAuthority(questionAuthority, () => runStructuredInput({
				input: compileStructuredInputQuestions({
					questions: request.questions.map((question) => ({
						...question,
						isSecret: false
					})),
					intro: request.intro?.trim() || "Agent needs input:"
				}),
				sessionKey: run.sessionKey ?? run.sessionId,
				agentId: run.agentId,
				runId: run.runId,
				timeoutMs: run.timeoutMs,
				delivery: {
					onBlockReply: run.onBlockReply,
					onPartialReply: run.onPartialReply
				},
				signal,
				isActive: () => {
					try {
						assertQuestionActive();
						return true;
					} catch {
						return false;
					}
				},
				questionId: request.toolCallId ? (batch) => `${request.toolCallId}:${batch}` : void 0
			}));
			try {
				assertQuestionActive();
			} catch {
				return cancelUserInput("OpenClaw cancelled operator input: the admitted run closed before the answer was committed.");
			}
			return result.status === "answered" ? {
				status: "answered",
				answers: result.answers
			} : cancelUserInput(result.message ?? "OpenClaw cancelled operator input; continue with your best judgment.");
		} catch {
			return cancelUserInput("OpenClaw could not collect operator input; continue with your best judgment.");
		} finally {
			params.onPendingInput(-1);
		}
	};
}
function waitForIteratorValue(iterator, signal) {
	if (signal.aborted) return Promise.reject(toErrorObject(signal.reason, "CLI plugin execution was aborted."));
	return new Promise((resolve, reject) => {
		const rejectAborted = () => reject(toErrorObject(signal.reason, "CLI plugin execution was aborted."));
		signal.addEventListener("abort", rejectAborted, { once: true });
		iterator.next().then((value) => {
			signal.removeEventListener("abort", rejectAborted);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", rejectAborted);
			reject(toErrorObject(error, "CLI plugin execution stream failed."));
		});
	});
}
async function closePluginIterator(iterator) {
	if (!iterator?.return) return;
	let timeout;
	try {
		await Promise.race([iterator.return(), new Promise((_, reject) => {
			timeout = setTimeout(() => reject(/* @__PURE__ */ new Error("CLI plugin runtime did not close after its run ended.")), PLUGIN_ITERATOR_CLOSE_TIMEOUT_MS);
			timeout.unref();
		})]);
	} catch (error) {
		recordAgentCleanupFailure();
		throw error;
	} finally {
		clearTimeout(timeout);
	}
}
/** Runs a prepared plugin transport while keeping cancellation and approvals host-owned. */
async function executePluginOwnedProcess(params) {
	const run = params.context.params;
	const cwd = params.context.cwd ?? params.context.workspaceDir;
	const executable = process.platform === "win32" ? resolveWindowsExecutablePath(params.executionCommand, params.env, cwd) : params.executionCommand;
	let command = resolveExecutablePath(executable, {
		cwd,
		env: params.env
	});
	if (!command) throw new Error(`CLI backend executable could not be resolved: ${params.executionCommand}`);
	let executionArgs = params.executionArgs;
	if (process.platform === "win32") {
		const program = resolveWindowsSpawnProgramCandidate({
			command,
			env: params.env
		});
		command = program.resolution === "node-entrypoint" ? resolveWindowsExecutablePath("node", params.env, cwd) : program.command;
		if (program.leadingArgv.length > 0) executionArgs = [...program.leadingArgv, ...executionArgs];
	}
	const startedAt = Date.now();
	const controller = new AbortController();
	const signal = run.abortSignal ? AbortSignal.any([controller.signal, run.abortSignal]) : controller.signal;
	const assertCurrent = createCliRunCurrentAssertion(run, signal);
	const assertRunCurrent = createCliRunCurrentAssertion(run);
	const termination = { reason: "exit" };
	const assertCaptureCurrent = () => (termination.reason === "exit" ? assertRunCurrent : assertCurrent)();
	const outstanding = {
		approvals: 0,
		background: 0,
		observed: false,
		replayUnsafe: false
	};
	const reportOutstandingWork = () => params.onOutstandingWorkChange?.(outstanding.approvals > 0 || outstanding.background > 0);
	const updatePendingApproval = (delta) => {
		outstanding.approvals = Math.max(0, outstanding.approvals + delta);
		reportOutstandingWork();
	};
	const watchdog = createCliPluginWatchdog({
		provider: run.provider,
		model: params.context.modelId,
		sessionId: run.sessionId,
		lane: run.lane,
		overallTimeoutMs: clampPositiveTimerTimeoutMs(run.timeoutMs),
		noOutputTimeoutMs: clampPositiveTimerTimeoutMs(params.noOutputTimeoutMs),
		useResume: params.useResume,
		getActiveAskUserDeadline: params.getActiveLoopbackAskUserDeadline,
		activeToolCount: () => Math.max(params.activeToolCount?.() ?? 0, outstanding.approvals),
		backgroundTaskCount: () => outstanding.background,
		hasObservedActivity: () => outstanding.observed,
		hasReplayUnsafeActivity: () => outstanding.replayUnsafe,
		onNoOutputTimeout: (error) => {
			termination.reason = "no-output-timeout";
			params.onNoOutputTimeout?.(error);
			controller.abort(error);
		},
		onOverallTimeout: () => {
			termination.reason = "overall-timeout";
			controller.abort(/* @__PURE__ */ new Error("CLI plugin runtime exceeded its execution timeout."));
		}
	}, params.watchdogClock);
	const stopAskUserDeadlineListener = params.onActiveLoopbackAskUserDeadlineChange?.(() => watchdog.reset());
	const replyBackendHandle = run.replyOperation ? {
		kind: "cli",
		runId: run.runId,
		toolAuthorityFingerprint: run.toolAuthorityFingerprint,
		terminalReplyExpectation: resolveReplyExpectation(run),
		cancel: () => {
			termination.reason = "manual-cancel";
			controller.abort(createCliAbortError());
		}
	} : void 0;
	if (replyBackendHandle) run.replyOperation?.attachBackend(replyBackendHandle);
	let iterator;
	let liveSession;
	let terminalResult = "none";
	try {
		assertCurrent();
		watchdog.reset();
		if (params.liveSession && (params.forceNewSession || Boolean(params.context.preparedBackend.backend.resumeArgs?.length) && !params.useResume)) {
			if (params.liveSession.requiredGeneration) throw new Error("The required CLI live session cannot be replaced by a fresh process.");
			await restartCliLiveSession(params.context, signal);
		}
		assertCurrent();
		if (params.liveSession) liveSession = createCliLiveSessionCapability({
			context: params.context,
			argv: [command, ...executionArgs],
			argv0: params.executionArgv0,
			env: params.env,
			...params.liveSession,
			captureKey: params.mcpCapture?.captureKey,
			beginCapture: (captureKey) => params.mcpCapture?.beginCapture(captureKey, assertCaptureCurrent),
			abortSignal: signal,
			claimResources: params.context.preparedBackend.claimLiveSessionResources
		});
		else params.mcpCapture?.beginCapture(params.mcpCapture.captureKey, assertCaptureCurrent);
		assertCurrent();
		iterator = params.execute({
			command,
			argv0: params.executionArgv0,
			args: executionArgs,
			cwd,
			env: params.env,
			prompt: params.prompt,
			...params.promptContext ? { promptContext: params.promptContext } : {},
			modelId: params.context.normalizedModel,
			systemPrompt: stripSystemPromptCacheBoundary(params.context.systemPrompt).trim(),
			...params.sessionId ? { sessionId: params.sessionId } : {},
			useResume: params.useResume,
			abortSignal: signal,
			assertCurrent,
			timeoutMs: run.timeoutMs,
			...run.executionMode ? { executionMode: run.executionMode } : {},
			...run.cliToolAvailability ? { toolAvailability: run.cliToolAvailability } : {},
			...liveSession ? { liveSession } : {},
			requestToolPermission: createPluginToolPermissionHandler({
				context: params.context,
				abortSignal: signal,
				onPendingApproval: updatePendingApproval,
				env: params.env
			}),
			requestUserInput: createPluginUserInputHandler({
				context: params.context,
				abortSignal: signal,
				onPendingInput: updatePendingApproval
			})
		})[Symbol.asyncIterator]();
		for (;;) {
			const next = await waitForIteratorValue(iterator, signal);
			if (next.done) break;
			if (!isRecord(next.value)) {
				outstanding.replayUnsafe = true;
				throw new Error("CLI plugin runtime emitted an invalid structured stream event.");
			}
			if (next.value.type === "result" && next.value.openclaw_interim_result !== true) terminalResult = terminalResult === "error" || next.value.is_error === true || typeof next.value.subtype === "string" && next.value.subtype.startsWith("error_") ? "error" : "success";
			if (next.value.type === "system" && next.value.subtype === "background_tasks_changed" && Array.isArray(next.value.tasks)) {
				outstanding.background = next.value.tasks.filter(isRecord).length;
				reportOutstandingWork();
			}
			params.consumeStdout(`${JSON.stringify(next.value)}\n`);
			outstanding.observed = true;
			if (!(next.value.type === "system" && next.value.subtype === "init") && next.value.type !== "command_lifecycle") outstanding.replayUnsafe = true;
			watchdog.noteOutput();
		}
		if (terminalResult === "none") throw new Error("CLI plugin runtime completed without a terminal result.");
	} catch (error) {
		if (run.abortSignal?.aborted || termination.reason === "manual-cancel") {
			const reason = isSignalTimeoutReason(run.abortSignal?.reason) ? "timeout" : "aborted";
			if (!params.onInterrupted?.(reason)) throw createCliAbortError();
			termination.reason = "manual-cancel";
		}
		if (termination.reason === "exit" && terminalResult !== "error") {
			if (params.liveSession?.requiredGeneration && isReplaySafeCliResumeControlOnly(params.useResume, outstanding.replayUnsafe, Boolean(outstanding.approvals || outstanding.background || params.activeToolCount?.()))) try {
				liveSession?.current();
			} catch (sessionError) {
				if (sessionError instanceof FailoverError && sessionError.reason === "session_expired") {
					const { code, message, reason } = sessionError;
					throw createCliFailoverError(message, reason, sessionError, {
						cause: error,
						code
					});
				}
			}
			throw error;
		}
	} finally {
		watchdog.dispose();
		stopAskUserDeadlineListener?.();
		params.onOutstandingWorkChange?.(false);
		if (!controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("CLI plugin runtime turn is no longer active."));
		if (replyBackendHandle) run.replyOperation?.detachBackend(replyBackendHandle);
		await closePluginIterator(iterator);
	}
	return {
		reason: termination.reason,
		exitCode: termination.reason === "exit" ? 0 : null,
		exitSignal: null,
		durationMs: Date.now() - startedAt,
		stdout: "",
		stderr: "",
		timedOut: termination.reason === "overall-timeout" || termination.reason === "no-output-timeout",
		noOutputTimedOut: termination.reason === "no-output-timeout"
	};
}
//#endregion
//#region src/agents/cli-runner/output-error.ts
function createCliOutputFailoverError(params) {
	if (!params.output.errorText) return;
	const message = formatCliOutputError(params.output, {
		runId: params.runId,
		sessionId: params.sessionId
	});
	const terminalFailure = params.output.terminalFailure?.reason;
	const reason = terminalFailure ? terminalFailure === "synthetic_no_response" ? "format" : "unknown" : classifyFailoverReason(message, { provider: params.provider }) ?? "unknown";
	const code = terminalFailure ? `cli_${terminalFailure}` : reason === "context_overflow" ? "cli_context_overflow" : void 0;
	return new FailoverError(message, {
		reason,
		provider: params.provider,
		model: params.model,
		sessionId: params.sessionId,
		lane: params.lane,
		status: resolveFailoverStatus(reason),
		code,
		rawError: params.output.errorText
	});
}
//#endregion
//#region src/agents/cli-runner/execute-process.ts
const CLI_RUNNER_OUTPUT_PARSE_BYTES = 1048576;
async function executeCliProcess(params) {
	const context = params.context;
	const runParams = context.params;
	const failoverContext = {
		provider: runParams.provider,
		model: context.modelId,
		sessionId: runParams.sessionId,
		lane: runParams.lane
	};
	const outputErrorContext = {
		...failoverContext,
		runId: runParams.runId
	};
	const resumeAtArg = params.useResume && runParams.cliSessionResumeAt ? params.backend.resumeAtArg : void 0;
	const streamingParser = params.outputMode === "jsonl" ? createCliJsonlStreamingParser({
		backend: params.backend,
		providerId: context.backendResolved.id,
		parseJsonlEvent: context.backendResolved.parseJsonlEvent,
		parseJsonlLifecycleEvent: context.backendResolved.parseJsonlLifecycleEvent,
		onAssistantDelta: params.events.emitCliAssistantDelta,
		onCompletedReply: params.events.emitCliCompletedReply,
		onThinkingDelta: params.events.emitCliThinkingDelta,
		onThinkingProgress: params.events.emitCliThinkingProgress,
		onCompaction: params.events.emitCliCompaction,
		onToolUseStart: params.events.emitParsedToolUseStart,
		onToolResult: params.events.emitParsedToolResult,
		onDisplayToolUseStart: params.events.emitCliDisplayToolUseStart,
		onDisplayToolResult: params.events.emitCliDisplayToolResult,
		onCommentaryText: params.events.emitLiveEvents && runParams.emitCommentaryText ? params.events.emitCliCommentaryText : void 0,
		onSessionId: params.observeForkSuccessor,
		onNativeTools: context.preparedBackend.mcpClientGrantCapture?.captureNativeTools,
		onAssistantMessage: params.diagnostics?.observeAssistantMessage,
		onUsage: params.diagnostics?.observeUsage
	}) : null;
	let stdoutTail = "";
	const stdoutCapture = createCapturedOutputBuffers();
	let stdoutBytes = 0;
	const stdoutHash = crypto.createHash("sha256");
	let stderrTail = "";
	const stderrCapture = createCapturedOutputBuffers();
	let stderrBytes = 0;
	const stderrHash = crypto.createHash("sha256");
	const reportStreamProgress = createModelCallStreamProgressReporter({ recordProgress: () => backendActivity?.observeOutput(true) ?? false });
	const streamProgressTarget = {
		runId: runParams.runId,
		...runParams.sessionKey ? { sessionKey: runParams.sessionKey } : {},
		...runParams.sessionId ? { sessionId: runParams.sessionId } : {}
	};
	const consumeStdout = (chunk) => {
		const chunkBytes = Buffer.byteLength(chunk);
		params.diagnostics?.observeCliOutput(chunk, "stdout", chunkBytes);
		if (chunkBytes > 0) {
			if (params.events.activeParsedToolCount() === 0) reportStreamProgress(streamProgressTarget);
			else backendActivity?.observeOutput(false);
		}
		stdoutBytes += chunkBytes;
		stdoutHash.update(chunk);
		stdoutTail = appendCliOutputTail(stdoutTail, chunk);
		if (chunk && stdoutCapture.truncatedBytes === 0) appendCapturedOutput(stdoutCapture, chunk, CLI_RUNNER_OUTPUT_PARSE_BYTES, "head");
		streamingParser?.push(chunk);
	};
	const consumeStderr = (chunk) => {
		params.diagnostics?.observeCliOutput(chunk, "stderr");
		stderrBytes += Buffer.byteLength(chunk);
		stderrHash.update(chunk);
		stderrTail = appendCliOutputTail(stderrTail, chunk);
		if (chunk && stderrCapture.truncatedBytes === 0) appendCapturedOutput(stderrCapture, chunk, CLI_RUNNER_OUTPUT_PARSE_BYTES, "head");
	};
	runParams.onExecutionPhase?.({
		phase: "process_spawned",
		provider: runParams.provider,
		model: context.modelId,
		backend: context.backendResolved.id
	});
	let managedRunPid;
	let nodeRunAbortSignal;
	let nodeRunTruncated = false;
	const pluginTimeout = {};
	let terminalInterruption;
	let result;
	runParams.assertCurrent?.();
	params.diagnostics?.observeRequestPayload(params.stdin ?? params.argsPrompt ?? "");
	params.assertCurrent();
	const backendActivity = runParams.diagnosticOwner ? beginDiagnosticBackendActivity({
		owner: runParams.diagnosticOwner,
		noOutputTimeoutMs: params.noOutputTimeoutMs,
		assertCurrent: params.assertCurrent
	}) : void 0;
	try {
		if (params.nodePlacement) {
			const nodeRun = await executeNodeClaudeRun({
				context,
				nodePlacement: params.nodePlacement,
				executionArgs: params.resolveExecutionArgs(),
				stdinPayload: params.stdin ?? "",
				...params.nodeSystemPrompt !== void 0 ? { nodeSystemPrompt: params.nodeSystemPrompt } : {},
				...params.nodeEnv ? { nodeEnv: params.nodeEnv } : {},
				...params.nodeClearEnv ? { nodeClearEnv: params.nodeClearEnv } : {},
				noOutputTimeoutMs: params.noOutputTimeoutMs,
				consumeStdout,
				consumeStderr,
				deps: params.deps
			});
			result = nodeRun.result;
			nodeRunAbortSignal = nodeRun.nodeRunAbortSignal;
			nodeRunTruncated = nodeRun.nodeRunTruncated;
		} else if (context.executionTarget.kind === "plugin") result = await executePluginOwnedProcess({
			context,
			execute: context.executionTarget.execute,
			watchdogClock: params.deps.watchdogClock,
			executionCommand: params.executionCommand,
			executionArgv0: params.executionArgv0,
			executionArgs: [...params.executionLeadingArgv, ...params.resolveExecutionArgs()],
			env: params.env,
			prompt: params.prompt,
			...params.promptContext ? { promptContext: params.promptContext } : {},
			useResume: params.useResume,
			forceNewSession: params.cliSessionIdToUse === void 0 && context.openClawHistoryPrompt !== void 0,
			sessionId: params.resolvedSessionId,
			noOutputTimeoutMs: params.noOutputTimeoutMs,
			consumeStdout,
			onOutstandingWorkChange: backendActivity?.setOutstandingWork,
			activeToolCount: params.events.activeParsedToolCount,
			getActiveLoopbackAskUserDeadline: params.toolTracking.getActiveLoopbackAskUserDeadline,
			onActiveLoopbackAskUserDeadlineChange: params.toolTracking.onActiveLoopbackAskUserDeadlineChange,
			onNoOutputTimeout: (error) => {
				pluginTimeout.error = error;
			},
			onInterrupted: (reason) => {
				streamingParser?.finish();
				const partialOutput = streamingParser?.getOutput();
				if (!partialOutput?.text.trim() || partialOutput.errorText || partialOutput.terminalFailure) return false;
				terminalInterruption = { reason };
				return true;
			},
			mcpCapture: {
				captureKey: params.initialGatewayCaptureKey,
				beginCapture: params.toolTracking.beginGatewayCapture
			},
			...params.useManagedClaudeLiveSession ? { liveSession: { requiredGeneration: params.cliSessionIdToUse ? context.requiredClaudeLiveSessionGeneration : void 0 } } : {}
		}).catch((error) => {
			runParams.assertCurrent?.();
			if (runParams.abortSignal?.aborted || params.events.hasObservedCliActivity()) throw error;
			throw resolveCliResumeAtError(error, resumeAtArg, failoverContext) ?? error;
		});
		else {
			const supervisor = params.deps.getProcessSupervisor();
			const scopeKey = buildCliSupervisorScopeKey({
				backend: params.backend,
				backendId: context.backendResolved.id,
				cliSessionId: params.useResume ? params.resolvedSessionId : void 0
			});
			if (runParams.abortSignal?.aborted) throw createCliAbortError();
			let processCancelled = false;
			const assertProcessCurrent = () => {
				params.assertCurrent();
				if (processCancelled) throw new Error("CLI process authority is no longer active");
			};
			const abortManagedRun = () => {
				processCancelled = true;
				supervisor.cancel(runParams.runId, "manual-cancel");
			};
			runParams.abortSignal?.addEventListener("abort", abortManagedRun, { once: true });
			try {
				params.toolTracking.beginGatewayCapture(params.initialGatewayCaptureKey, assertProcessCurrent);
				const managedRun = await supervisor.spawn({
					assertCurrent: params.assertCurrent,
					runId: runParams.runId,
					scopeKey,
					replaceExistingScope: Boolean(params.useResume && scopeKey),
					mode: "child",
					argv: [params.executionCommand, ...params.executionLeadingArgv],
					resolveArgs: params.resolveExecutionArgs,
					argv0: params.executionArgv0,
					timeoutMs: runParams.timeoutMs,
					noOutputTimeoutMs: params.noOutputTimeoutMs,
					onCancel: () => {
						processCancelled = true;
					},
					cwd: context.cwd ?? context.workspaceDir,
					env: params.env,
					input: params.stdin ?? "",
					secretInput: context.preparedBackend.secretInput,
					captureOutput: false,
					onStdout: consumeStdout,
					onStderr: consumeStderr
				});
				managedRunPid = managedRun.pid;
				const replyBackendHandle = runParams.replyOperation ? {
					kind: "cli",
					runId: runParams.runId,
					toolAuthorityFingerprint: runParams.toolAuthorityFingerprint,
					terminalReplyExpectation: resolveReplyExpectation(runParams),
					cancel: () => {
						processCancelled = true;
						managedRun.cancel("manual-cancel");
					}
				} : void 0;
				if (replyBackendHandle) runParams.replyOperation?.attachBackend(replyBackendHandle);
				try {
					result = await managedRun.wait();
					processCancelled ||= result.reason !== "exit";
				} finally {
					if (replyBackendHandle) runParams.replyOperation?.detachBackend(replyBackendHandle);
				}
			} finally {
				runParams.abortSignal?.removeEventListener("abort", abortManagedRun);
			}
		}
	} finally {
		backendActivity?.close();
	}
	if ((runParams.abortSignal?.aborted || nodeRunAbortSignal?.aborted) && result.reason === "manual-cancel" && !terminalInterruption) throw createCliAbortError();
	params.options?.onPhase?.("resolve");
	streamingParser?.finish();
	const streamingParserErrorText = params.outputMode === "jsonl" ? streamingParser?.getErrorText() ?? null : null;
	if (streamingParserErrorText) throw createCliFailoverError(streamingParserErrorText, "format", failoverContext);
	if (nodeRunTruncated && result.exitCode === 0 && !result.timedOut && !streamingParser?.hasTerminalResult()) throw createCliFailoverError("paired node truncated the Claude CLI stream before the terminal result; refusing to accept partial output.", "format", failoverContext);
	let stdout;
	const readStdout = () => stdout ??= Buffer.concat(stdoutCapture.chunks, stdoutCapture.bytes).toString("utf8").trim();
	const stdoutDiagnostic = stdoutTail.trim();
	const stderrDiagnostic = stderrTail.trim();
	const processDiagnostics = {
		backendId: context.backendResolved.id,
		processReason: result.reason,
		exitCode: result.exitCode,
		exitSignal: result.exitSignal,
		durationMs: result.durationMs,
		stdoutBytes,
		stdoutHash: stdoutHash.digest("hex").slice(0, 12),
		stderrBytes,
		stderrHash: stderrHash.digest("hex").slice(0, 12),
		useResume: params.useResume
	};
	if (params.logOutputText) {
		if (stdoutDiagnostic) cliBackendLog.info(`cli stdout:\n${stdoutDiagnostic}`);
		if (stderrDiagnostic) cliBackendLog.info(`cli stderr:\n${stderrDiagnostic}`);
	}
	if (shouldLogVerbose()) {
		if (stdoutDiagnostic) cliBackendLog.debug(`cli stdout:\n${stdoutDiagnostic}`);
		if (stderrDiagnostic) cliBackendLog.debug(`cli stderr:\n${stderrDiagnostic}`);
	}
	const streamedJsonlOutput = params.outputMode === "jsonl" ? streamingParser?.getOutput() ?? null : null;
	const parsedStructuredOutput = streamedJsonlOutput ?? (params.outputMode === "json" && stdoutCapture.truncatedBytes === 0 ? parseCliOutput({
		raw: readStdout(),
		backend: params.backend,
		providerId: context.backendResolved.id,
		outputMode: params.outputMode,
		fallbackSessionId: params.resolvedSessionId
	}) : null);
	if (parsedStructuredOutput?.terminalFailure) {
		const terminalError = createCliOutputFailoverError({
			output: parsedStructuredOutput,
			...outputErrorContext
		});
		if (terminalError) throw terminalError;
	}
	if (!terminalInterruption && (result.exitCode !== 0 || result.reason !== "exit")) {
		params.options?.onPhase?.("send");
		if (result.reason === "no-output-timeout" || result.noOutputTimedOut) {
			const timeoutSeconds = Math.round(params.noOutputTimeoutMs / 1e3);
			cliBackendLog.warn(`cli watchdog timeout: provider=${runParams.provider} model=${context.modelId} session=${params.resolvedSessionId ?? runParams.sessionId} noOutputTimeoutMs=${params.noOutputTimeoutMs} pid=${managedRunPid ?? "node"}`);
			const observedActivity = params.events.hasObservedCliActivity();
			const timeoutDecision = pluginTimeout.error ? { error: pluginTimeout.error } : resolveCliNoOutputTimeoutDecision({
				context: failoverContext,
				timeoutMs: params.noOutputTimeoutMs,
				quietDurationMs: params.noOutputTimeoutMs,
				cliTimeout: {
					mode: "no-output",
					timeoutSeconds,
					observedActivity,
					activeToolCount: params.events.activeParsedToolCount(),
					backgroundTaskCount: 0
				},
				hasOutputText: Boolean(stdoutDiagnostic || stderrDiagnostic),
				useResume: params.useResume,
				hasReplayUnsafeActivity: observedActivity
			});
			const deferNotice = timeoutDecision.error.code === "cli_no_output_timeout" && Boolean(params.cliSessionIdToUse) && Boolean(params.resolvedSessionId) && Boolean(context.openClawHistoryPrompt) && Boolean(runParams.sessionKey) && runParams.timeoutMs - (performance.now() - context.startedMonotonicMs) > 0;
			if (runParams.sessionKey && params.events.emitLiveEvents && !deferNotice) {
				const stallNotice = [
					`CLI agent (${runParams.provider}) produced no output for ${timeoutSeconds}s and was terminated.`,
					"It may have been waiting for interactive input or an approval prompt.",
					"Check CLI permission settings and OpenClaw approval prompts."
				].join(" ");
				const routing = resolveEventSessionRoutingPolicy({
					cfg: runParams.config,
					sessionKey: runParams.sessionKey,
					channel: runParams.messageProvider,
					accountId: runParams.agentAccountId
				});
				params.deps.enqueueSystemEvent(stallNotice, { sessionKey: resolveSystemEventQueueKey(resolveEventSessionKeyForPolicy(runParams.sessionKey, routing), runParams.agentId) });
				params.deps.requestHeartbeat(scopedHeartbeatWakeOptionsForPolicy(runParams.sessionKey, {
					source: "cli-watchdog",
					intent: "event",
					reason: "cli:watchdog:stall"
				}, routing));
			}
			throw timeoutDecision.error;
		}
		if (result.reason === "overall-timeout") throw createCliTimeoutError(failoverContext, {
			mode: "overall",
			timeoutSeconds: Math.round(runParams.timeoutMs / 1e3),
			observedActivity: params.events.hasObservedCliActivity(),
			activeToolCount: params.events.activeParsedToolCount(),
			backgroundTaskCount: 0
		}, "cli_overall_timeout");
		const retryEmptyFailure = result.reason === "exit" && !params.events.hasObservedCliActivity();
		const stderr = Buffer.concat(stderrCapture.chunks, stderrCapture.bytes).toString("utf8").trim();
		throw createCliExitFailoverError({
			context: failoverContext,
			candidates: [
				stderr,
				readStdout(),
				stderrDiagnostic,
				stdoutDiagnostic
			],
			fallbackMessage: "CLI failed.",
			retryEmptyFailure,
			resumeAtArg: retryEmptyFailure ? resumeAtArg : void 0
		});
	}
	if (stdoutCapture.truncatedBytes > 0 && !streamedJsonlOutput) throw createCliFailoverError(`CLI stdout exceeded ${CLI_RUNNER_OUTPUT_PARSE_BYTES} bytes; refusing to parse truncated output.`, "format", failoverContext);
	if (runParams.controlOperation === "compact") {
		const manualCompaction = context.backendResolved.manualCompaction;
		if (!manualCompaction) throw new Error(`CLI backend ${context.backendResolved.id} does not support manual compaction`);
		const validation = manualCompaction.validateOutput(readStdout());
		if (!validation.ok) throw createCliFailoverError(validation.reason, "unknown", failoverContext);
		return {
			text: "",
			rawText: "",
			diagnostics: { process: processDiagnostics },
			finalPromptText: params.prompt
		};
	}
	const parsed = parsedStructuredOutput ?? parseCliOutput({
		raw: readStdout(),
		backend: params.backend,
		providerId: context.backendResolved.id,
		outputMode: params.outputMode,
		fallbackSessionId: params.resolvedSessionId
	});
	const parsedError = createCliOutputFailoverError({
		output: parsed,
		...outputErrorContext
	});
	if (parsedError) throw parsedError;
	const rawText = parsed.text;
	cliBackendLog.info(`cli turn: provider=${runParams.provider} model=${context.modelId} durationMs=${Date.now() - params.cliTurnStartedAt} ${formatCliBackendOutputDigest(rawText)}`);
	return {
		...transformCliResultText(parsed, context.backendResolved.textTransforms?.output),
		...terminalInterruption ? { terminalInterruption } : {},
		diagnostics: {
			...parsed.diagnostics,
			process: processDiagnostics
		},
		finalPromptText: params.prompt
	};
}
//#endregion
//#region src/agents/cli-runner/execute-ask-user-deadline.ts
function createAskUserDeadlineTracking(activeTools, isOverflowed) {
	const deadlines = /* @__PURE__ */ new WeakMap();
	const state = {
		listeners: /* @__PURE__ */ new Set(),
		selected: void 0
	};
	const selectDeadline = () => {
		if (isOverflowed()) return;
		let earliest = Number.POSITIVE_INFINITY;
		for (const { loopbackCall: call, loopbackAmbiguous } of activeTools.values()) {
			if (!call || loopbackAmbiguous || call.ambiguous) continue;
			earliest = Math.min(earliest, deadlines.get(call) ?? Number.POSITIVE_INFINITY);
		}
		return Number.isFinite(earliest) ? earliest : void 0;
	};
	const refresh = () => {
		const nextDeadline = selectDeadline();
		if (nextDeadline === state.selected) return;
		state.selected = nextDeadline;
		state.listeners.forEach((listener) => listener());
	};
	const clear = (call) => {
		deadlines.delete(call);
		refresh();
	};
	const update = (call, toolName, args) => {
		deadlines.delete(call);
		if (toolName === "ask_user") try {
			deadlines.set(call, Date.now() + resolveQuestionTimeoutMs(args.timeoutSeconds));
		} catch {}
		refresh();
	};
	const onChange = (listener) => {
		state.listeners.add(listener);
		return () => void state.listeners.delete(listener);
	};
	return {
		clear,
		update,
		refresh,
		get: () => state.selected,
		onChange
	};
}
const normalizeCliMessagingToolName = stripOpenClawMcpToolPrefix;
function extractCliMessagingTarget(context, toolName, args) {
	const normalizedToolName = normalizeCliMessagingToolName(toolName);
	const currentProvider = context.params.messageChannel ?? context.params.messageProvider;
	const hasExplicitProvider = typeof args.provider === "string" && args.provider.trim().length > 0 || typeof args.channel === "string" && args.channel.trim().length > 0;
	const targetArgs = normalizedToolName === "message" && currentProvider && !hasExplicitProvider ? {
		...args,
		provider: currentProvider
	} : args;
	if (!isMessagingToolTargetEvidenceAction(normalizedToolName, targetArgs)) return;
	return extractMessagingToolSend(normalizedToolName, targetArgs, {
		config: context.params.config,
		currentChannelId: context.params.currentChannelId,
		currentThreadId: context.params.currentThreadTs,
		currentMessageId: context.params.currentMessageId
	});
}
function buildMessagingToolSendEvidenceKey(send) {
	return crypto.createHash("sha256").update(JSON.stringify([
		send.tool,
		send.provider,
		send.accountId,
		send.to,
		send.threadId,
		send.threadImplicit,
		send.threadSuppressed,
		send.text,
		send.mediaUrls
	])).digest("hex");
}
function extractCliMessagingContent(args, result) {
	const text = [
		"message",
		"SendMessage",
		"content",
		"text",
		"caption"
	].map((key) => args[key]).find((value) => typeof value === "string" && value.trim().length > 0);
	const mediaUrls = [...collectMessagingMediaUrlsFromRecord(args), ...collectMessagingMediaUrlsFromToolResult(result)].filter((url, index, all) => all.indexOf(url) === index);
	return {
		...text ? { text } : {},
		...mediaUrls.length > 0 ? { mediaUrls } : {}
	};
}
function appendUniqueCliMessagingEvidence(values, valueKeys, additions) {
	for (const addition of additions) {
		if (!addition || valueKeys.has(addition)) continue;
		if (values.length >= 64) {
			const removed = values.shift();
			if (removed) valueKeys.delete(removed);
		}
		values.push(addition);
		valueKeys.add(addition);
	}
}
//#endregion
//#region src/agents/cli-runner/execute-tool-tracking.ts
const CLI_LOOPBACK_CORRELATION_MAX_CALLS = 64;
const CLI_MCP_DELIVERY_DRAIN_GRACE_MS = 5e3;
const CLI_MCP_REQUEST_ADMISSION_GRACE_MS = 250;
function createCliToolTracking(context) {
	let gatewayCaptureKey;
	let yielded = false;
	let yieldAcknowledgment;
	let didSendViaMessagingTool = false;
	let didDeliverSourceReplyViaMessageTool = false;
	let sourceReplyDelivered;
	let inFlightUnclassifiedMcpRequests = 0;
	let inFlightMessagingToolCalls = 0;
	const inFlightPreparedMessagingCalls = /* @__PURE__ */ new Set();
	const pendingMessagingCalls = /* @__PURE__ */ new Map();
	const cliLoopbackCalls = [];
	const activeCliTools = /* @__PURE__ */ new Map();
	let cliLoopbackCorrelationOverflowed = false;
	const askUserDeadlines = createAskUserDeadlineTracking(activeCliTools, () => cliLoopbackCorrelationOverflowed);
	const messagingToolSentTexts = [];
	const messagingToolSentTextKeys = /* @__PURE__ */ new Set();
	const messagingToolSentMediaUrls = [];
	const messagingToolSentMediaUrlKeys = /* @__PURE__ */ new Set();
	const messagingToolSentTargets = [];
	const messagingToolSentTargetKeys = /* @__PURE__ */ new Set();
	const messagingToolSourceReplyPayloads = [];
	const toolMediaUrls = [];
	const toolMediaUrlKeys = /* @__PURE__ */ new Set();
	let toolAudioAsVoice = false;
	let toolTrustedLocalMedia = false;
	const acceptedSessionSpawns = [];
	const matchesCliLoopbackCall = (toolName, toolArgs, call) => normalizeCliMessagingToolName(toolName) === call.toolName && isDeepStrictEqual(toolArgs, call.args);
	const markCliLoopbackCallsAmbiguous = (calls, activeEntries = Array.from(activeCliTools.entries()).filter(([, activeTool]) => activeTool.loopbackCall !== void 0 && calls.includes(activeTool.loopbackCall))) => {
		const groups = /* @__PURE__ */ new Set();
		for (const call of calls) if (call.ambiguityGroup) groups.add(call.ambiguityGroup);
		for (const [, activeTool] of activeEntries) if (activeTool.ambiguityGroup) groups.add(activeTool.ambiguityGroup);
		const group = groups.values().next().value ?? {
			calls: /* @__PURE__ */ new Set(),
			activeToolCallIds: /* @__PURE__ */ new Set()
		};
		for (const existing of groups) {
			if (existing === group) continue;
			for (const call of existing.calls) {
				call.ambiguityGroup = group;
				group.calls.add(call);
			}
			for (const toolCallId of existing.activeToolCallIds) {
				const activeTool = activeCliTools.get(toolCallId);
				if (activeTool) {
					activeTool.ambiguityGroup = group;
					group.activeToolCallIds.add(toolCallId);
				}
			}
			existing.calls.clear();
			existing.activeToolCallIds.clear();
		}
		for (const call of calls) {
			call.ambiguous = true;
			call.ambiguityGroup = group;
			group.calls.add(call);
		}
		for (const [toolCallId, activeTool] of activeEntries) {
			activeTool.loopbackAmbiguous = true;
			activeTool.ambiguityGroup = group;
			group.activeToolCallIds.add(toolCallId);
		}
		askUserDeadlines.refresh();
	};
	const matchingActiveCliTools = (call) => Array.from(activeCliTools.entries()).filter(([, activeTool]) => matchesCliLoopbackCall(activeTool.toolName, activeTool.args, call));
	const markCliLoopbackSignatureAmbiguous = (call) => {
		const calls = cliLoopbackCalls.filter((candidate) => matchesCliLoopbackCall(call.toolName, call.args, candidate.admitted));
		markCliLoopbackCallsAmbiguous(calls, matchingActiveCliTools(call));
	};
	const retainCliLoopbackCall = (call) => {
		if (cliLoopbackCalls.length >= CLI_LOOPBACK_CORRELATION_MAX_CALLS) {
			cliLoopbackCorrelationOverflowed = true;
			for (const activeTool of activeCliTools.values()) if (activeTool.loopbackCall || activeTool.toolName.startsWith("mcp__")) activeTool.loopbackAmbiguous = true;
			cliLoopbackCalls.length = 0;
			askUserDeadlines.refresh();
			return;
		}
		const retained = {
			admitted: call,
			current: call,
			ambiguous: false
		};
		cliLoopbackCalls.push(retained);
		return retained;
	};
	const bindCliLoopbackCall = (call, toolCallId, activeTool) => {
		call.boundToolCallId = toolCallId;
		activeTool.loopbackCall = call;
		activeTool.loopbackAmbiguous ||= call.ambiguous;
		if (call.ambiguityGroup) {
			activeTool.ambiguityGroup = call.ambiguityGroup;
			call.ambiguityGroup.activeToolCallIds.add(toolCallId);
		}
		askUserDeadlines.refresh();
	};
	const removeCliLoopbackCall = (call) => {
		if (!call) return;
		const index = cliLoopbackCalls.indexOf(call);
		if (index >= 0) cliLoopbackCalls.splice(index, 1);
	};
	const retireCliLoopbackCorrelation = (toolCallId, activeTool) => {
		removeCliLoopbackCall(activeTool?.loopbackCall);
		const group = activeTool?.ambiguityGroup;
		if (!group) return;
		group.activeToolCallIds.delete(toolCallId);
		const hasUnboundCall = Array.from(group.calls).some((call) => call.boundToolCallId === void 0 && cliLoopbackCalls.includes(call));
		if (group.activeToolCallIds.size > 0 || hasUnboundCall) return;
		for (const call of group.calls) removeCliLoopbackCall(call);
		group.calls.clear();
	};
	const commitMessagingToolResult = (params) => {
		const deliveryFact = readEmbeddedMessageDeliveryFact(readToolResultDetails(params.result)?.messageDelivery);
		if (!(deliveryFact ? deliveryFact.status === "settled" && (params.isError !== true || deliveryFact.partialDelivery) : isDeliveredMessagingToolResult(params))) return;
		didSendViaMessagingTool = true;
		if (deliveryFact?.sourceReplyDelivered === true) sourceReplyDelivered = true;
		const toolArgs = params.args ?? {};
		const isMessagingSend = isMessagingToolSendAction(params.toolName, toolArgs);
		const content = isMessagingSend ? extractCliMessagingContent(toolArgs, params.result) : {};
		const confirmedTarget = params.target && extractMessagingToolSendResult(params.target, params.result);
		const deliveredCurrentSourceReply = isDeliveredMessageToolOnlySourceReplyResult({
			sourceReplyDeliveryMode: context.params.sourceReplyDeliveryMode,
			toolName: params.toolName,
			args: params.args,
			result: params.result,
			isError: params.isError,
			allowExplicitSourceRoute: isDeliveredMessagingToolSendToCurrentSource({
				send: confirmedTarget,
				config: context.params.config,
				currentProvider: context.params.messageChannel ?? context.params.messageProvider,
				currentAccountId: context.params.agentAccountId,
				currentChannelId: context.params.currentChannelId,
				currentThreadId: context.params.currentThreadTs,
				sessionKey: context.params.sessionKey,
				deliveredPayload: params.result
			}),
			deliveryConfirmed: true
		});
		const sourceReplyFinal = deliveredCurrentSourceReply ? resolveMessageToolSourceReplyFinal(toolArgs) : void 0;
		if (isMessagingSend) {
			appendUniqueCliMessagingEvidence(messagingToolSentTexts, messagingToolSentTextKeys, content.text ? [content.text] : []);
			appendUniqueCliMessagingEvidence(messagingToolSentMediaUrls, messagingToolSentMediaUrlKeys, content.mediaUrls ?? []);
		}
		if (deliveredCurrentSourceReply) {
			didDeliverSourceReplyViaMessageTool = true;
			const payload = extractMessagingToolSourceReplyPayload(params.result);
			if (payload) {
				if (messagingToolSourceReplyPayloads.length >= 64) messagingToolSourceReplyPayloads.shift();
				messagingToolSourceReplyPayloads.push({
					...payload,
					...sourceReplyFinal !== void 0 ? { sourceReplyFinal } : {}
				});
			}
		}
		if (!confirmedTarget) return;
		const targetWithContent = {
			...confirmedTarget,
			...content,
			...sourceReplyFinal !== void 0 ? { sourceReplyFinal } : {}
		};
		const evidenceKey = buildMessagingToolSendEvidenceKey(targetWithContent);
		if (messagingToolSentTargetKeys.has(evidenceKey)) return;
		if (messagingToolSentTargets.length >= 64) {
			const removed = messagingToolSentTargets.shift();
			if (removed) messagingToolSentTargetKeys.delete(buildMessagingToolSendEvidenceKey(removed));
		}
		messagingToolSentTargets.push(targetWithContent);
		messagingToolSentTargetKeys.add(evidenceKey);
	};
	const isPreparedInternalSourceReply = async (call) => {
		if (context.params.sourceReplyDeliveryMode !== "message_tool_only" || normalizeCliMessagingToolName(call.toolName) !== "message" || call.args.action !== "send" || !context.params.config) return false;
		return await shouldUseInternalSourceReplySink({
			cfg: context.params.config,
			action: "send",
			sessionKey: context.params.sessionKey,
			sourceReplyDeliveryMode: context.params.sourceReplyDeliveryMode,
			toolContext: {
				currentChannelProvider: context.params.messageChannel ?? context.params.messageProvider,
				currentChannelId: context.params.currentChannelId,
				currentThreadTs: context.params.currentThreadTs,
				currentMessageId: context.params.currentMessageId,
				replyToMode: context.params.replyToMode
			}
		}, call.args);
	};
	const beginGatewayCapture = (captureKey, assertCurrent) => {
		if (!captureKey || gatewayCaptureKey === captureKey) return;
		if (gatewayCaptureKey) throw new Error("CLI MCP capture key changed during an active attempt");
		context.preparedBackend.mcpClientGrantCapture?.activate(captureKey, assertCurrent);
		gatewayCaptureKey = captureKey;
		const isPotentialDelivery = (toolName) => isMessagingTool(normalizeCliMessagingToolName(toolName));
		const isPreparedDelivery = (toolName, toolArgs) => toolArgs.dryRun !== true && isMessagingToolDeliveryAction(normalizeCliMessagingToolName(toolName), toolArgs);
		beginMcpLoopbackToolCallCapture({
			captureKey,
			onYield: (_message, acknowledgment) => {
				yielded = true;
				yieldAcknowledgment = acknowledgment;
			},
			onRequestStart: () => {
				inFlightUnclassifiedMcpRequests += 1;
			},
			onRequestClassified: () => {
				inFlightUnclassifiedMcpRequests = Math.max(0, inFlightUnclassifiedMcpRequests - 1);
			},
			onToolCallStart: (call) => {
				const retained = retainCliLoopbackCall(call);
				const candidates = matchingActiveCliTools(call);
				let matched = retained && candidates.length === 1 && !candidates[0]?.[1].loopbackCall && !candidates[0]?.[1].loopbackAmbiguous ? candidates[0] : void 0;
				if (retained && matched) bindCliLoopbackCall(retained, matched[0], matched[1]);
				else if (retained && candidates.length > 0) {
					markCliLoopbackSignatureAmbiguous(call);
					matched = candidates.find(([, activeTool]) => !activeTool.loopbackCall);
					if (matched) bindCliLoopbackCall(retained, matched[0], matched[1]);
				}
				if (isPotentialDelivery(call.toolName)) inFlightMessagingToolCalls += 1;
				return matched?.[0];
			},
			onToolCallUpdate: ({ previous, current }) => {
				const candidates = cliLoopbackCalls.filter((candidate) => matchesCliLoopbackCall(previous.toolName, previous.args, candidate.current));
				const candidate = candidates.at(0);
				if (candidates.length === 1 && candidate && !candidate.ambiguous) {
					candidate.current = current;
					const toolName = normalizeCliMessagingToolName(current.toolName);
					askUserDeadlines.update(candidate, toolName, current.args);
				} else if (candidates.length > 0) markCliLoopbackCallsAmbiguous(candidates);
				inFlightPreparedMessagingCalls.delete(previous);
				const wasDelivery = isPotentialDelivery(previous.toolName);
				const isDelivery = isPreparedDelivery(current.toolName, current.args);
				if (wasDelivery !== isDelivery) inFlightMessagingToolCalls = Math.max(0, inFlightMessagingToolCalls + (isDelivery ? 1 : -1));
				if (isDelivery) inFlightPreparedMessagingCalls.add(current);
			},
			onToolCallFinish: (call, { prepared }) => {
				if (prepared ? isPreparedDelivery(call.toolName, call.args) : isPotentialDelivery(call.toolName)) inFlightMessagingToolCalls = Math.max(0, inFlightMessagingToolCalls - 1);
				inFlightPreparedMessagingCalls.delete(call);
			},
			onToolCallResult: (call) => {
				const terminalOutcome = call.outcome === "blocked" ? {
					outcome: call.outcome,
					deniedReason: call.deniedReason
				} : { outcome: call.outcome };
				const correlated = call.correlationId ? cliLoopbackCalls.find((candidate) => candidate.boundToolCallId === call.correlationId) : void 0;
				const candidates = correlated ? [correlated] : cliLoopbackCalls.filter((candidate) => matchesCliLoopbackCall(call.toolName, call.args, candidate.current));
				if (candidates.length === 1 && candidates[0]) candidates[0].outcome = terminalOutcome;
				else if (candidates.length > 1) markCliLoopbackCallsAmbiguous(candidates);
				const toolName = normalizeCliMessagingToolName(call.toolName);
				const acceptedSessionSpawn = toolName === "sessions_spawn" && call.outcome === "completed" && "result" in call ? normalizeAcceptedSessionSpawnResult(call.result) : null;
				if (acceptedSessionSpawn && acceptedSessionSpawns.length < CLI_LOOPBACK_CORRELATION_MAX_CALLS) acceptedSessionSpawns.push(acceptedSessionSpawn);
				if (isMessagingToolDeliveryAction(toolName, call.args)) commitMessagingToolResult({
					toolName,
					target: extractCliMessagingTarget(context, toolName, call.args),
					args: call.args,
					result: "result" in call ? call.result : void 0,
					isError: call.outcome !== "completed"
				});
				else if (call.outcome === "completed" && "result" in call) {
					const artifact = extractToolResultMediaArtifact(call.result);
					const mediaUrls = artifact ? filterToolResultMediaUrls(toolName, artifact.mediaUrls, call.result) : [];
					appendUniqueCliMessagingEvidence(toolMediaUrls, toolMediaUrlKeys, mediaUrls);
					if (mediaUrls.length > 0) {
						toolAudioAsVoice ||= artifact?.audioAsVoice === true;
						toolTrustedLocalMedia ||= artifact?.trustedLocalMedia === true;
					}
				}
			}
		});
	};
	const handleCliToolUseStart = (event) => {
		if (event.kind !== "server_tool_use") {
			const activeTool = {
				toolName: event.name,
				args: event.args,
				loopbackAmbiguous: cliLoopbackCorrelationOverflowed && event.name.startsWith("mcp__")
			};
			activeCliTools.set(event.toolCallId, activeTool);
			const admittedCall = {
				toolName: normalizeCliMessagingToolName(event.name),
				args: event.args
			};
			const pendingCandidates = cliLoopbackCalls.filter((candidate) => candidate.boundToolCallId === void 0 && matchesCliLoopbackCall(event.name, event.args, candidate.admitted));
			const hasAssociatedPeer = matchingActiveCliTools(admittedCall).some(([toolCallId, peer]) => toolCallId !== event.toolCallId && (peer.loopbackCall !== void 0 || peer.loopbackAmbiguous));
			const pending = pendingCandidates[0];
			if (hasAssociatedPeer || pendingCandidates.length > 1 || pending?.ambiguous) {
				markCliLoopbackSignatureAmbiguous(admittedCall);
				if (pending) bindCliLoopbackCall(pending, event.toolCallId, activeTool);
			} else if (pendingCandidates.length === 1 && pending) bindCliLoopbackCall(pending, event.toolCallId, activeTool);
		}
		const toolName = normalizeCliMessagingToolName(event.name);
		if (event.kind === "server_tool_use" || gatewayCaptureKey || event.args.dryRun === true || !isMessagingToolDeliveryAction(toolName, event.args)) return;
		if (pendingMessagingCalls.size >= 64) {
			const oldestToolCallId = pendingMessagingCalls.keys().next().value;
			if (oldestToolCallId !== void 0) {
				pendingMessagingCalls.delete(oldestToolCallId);
				didSendViaMessagingTool = true;
			}
		}
		pendingMessagingCalls.set(event.toolCallId, {
			toolName,
			args: event.args,
			target: extractCliMessagingTarget(context, toolName, event.args)
		});
	};
	const handleCliToolResult = (event) => {
		const activeTool = activeCliTools.get(event.toolCallId);
		if (activeTool?.loopbackCall) askUserDeadlines.clear(activeTool.loopbackCall);
		activeCliTools.delete(event.toolCallId);
		retireCliLoopbackCorrelation(event.toolCallId, activeTool);
		const pending = pendingMessagingCalls.get(event.toolCallId);
		if (pending) {
			pendingMessagingCalls.delete(event.toolCallId);
			commitMessagingToolResult({
				toolName: pending.toolName,
				target: pending.target,
				args: pending.args,
				result: event.result,
				isError: event.isError
			});
		}
		return activeTool?.loopbackAmbiguous ? void 0 : activeTool?.loopbackCall?.current.args;
	};
	const resolveCliLoopbackTerminalOutcome = (toolCallId) => {
		const activeTool = activeCliTools.get(toolCallId);
		if (activeTool?.loopbackAmbiguous) return { outcome: "unknown" };
		return activeTool?.loopbackCall?.outcome;
	};
	const finishDeliveryTracking = async (params) => {
		try {
			if (!gatewayCaptureKey && pendingMessagingCalls.size > 0) {
				const calls = Array.from(pendingMessagingCalls.values());
				if ((await Promise.all(calls.map(isPreparedInternalSourceReply))).some((internal) => !internal)) {
					didSendViaMessagingTool = true;
					params.recordRunError(/* @__PURE__ */ new Error("CLI JSONL message tool call remained unresolved after exit"));
				} else params.recordRunError(/* @__PURE__ */ new Error("CLI JSONL source reply call remained unresolved after exit"));
			}
			if (!gatewayCaptureKey) return;
			if (await waitForMcpLoopbackToolCallCaptureIdle(gatewayCaptureKey, {
				timeoutMs: CLI_MCP_DELIVERY_DRAIN_GRACE_MS,
				admissionGraceMs: CLI_MCP_REQUEST_ADMISSION_GRACE_MS
			})) return;
			if (params.useManagedClaudeLiveSession) await closeCliLiveSession(context, "mcp-capture-rotation");
			const internalCount = (await Promise.all(Array.from(inFlightPreparedMessagingCalls).map(isPreparedInternalSourceReply))).filter(Boolean).length;
			if (inFlightUnclassifiedMcpRequests > 0 || inFlightMessagingToolCalls > internalCount) {
				didSendViaMessagingTool = true;
				params.recordRunError(/* @__PURE__ */ new Error("CLI message tool call remained in flight after exit"));
			} else if (inFlightMessagingToolCalls > 0) params.recordRunError(/* @__PURE__ */ new Error("CLI source reply call remained in flight after exit"));
		} catch (error) {
			if (pendingMessagingCalls.size > 0 || inFlightUnclassifiedMcpRequests > 0 || inFlightMessagingToolCalls > 0) didSendViaMessagingTool = true;
			params.recordRunError(error);
		}
	};
	const finalizeCapture = (finalizeParsedTools) => {
		try {
			finalizeParsedTools();
		} finally {
			if (gatewayCaptureKey) try {
				context.preparedBackend.mcpClientGrantCapture?.deactivate(gatewayCaptureKey);
			} finally {
				clearMcpLoopbackToolCallCapture(gatewayCaptureKey);
			}
		}
	};
	const evidence = () => ({
		didSendViaMessagingTool,
		didDeliverSourceReplyViaMessageTool,
		sourceReplyDelivered,
		messagingToolSentTexts,
		messagingToolSentMediaUrls,
		messagingToolSentTargets,
		messagingToolSourceReplyPayloads,
		toolMediaUrls,
		toolAudioAsVoice,
		toolTrustedLocalMedia,
		acceptedSessionSpawns
	});
	return {
		beginGatewayCapture,
		getActiveLoopbackAskUserDeadline: askUserDeadlines.get,
		onActiveLoopbackAskUserDeadlineChange: askUserDeadlines.onChange,
		handleCliToolUseStart,
		handleCliToolResult,
		resolveCliLoopbackTerminalOutcome,
		finishDeliveryTracking,
		finalizeCapture,
		withExecutionEvidence(output) {
			const current = evidence();
			return {
				...output,
				...yielded ? { yielded: true } : {},
				...yieldAcknowledgment ? { yieldAcknowledgment } : {},
				...projectCliMessagingDeliveryEvidence(current, true),
				...current.toolMediaUrls.length > 0 ? { toolMediaUrls: current.toolMediaUrls.slice() } : {},
				...current.toolAudioAsVoice ? { toolAudioAsVoice: true } : {},
				...current.toolTrustedLocalMedia ? { toolTrustedLocalMedia: true } : {},
				...current.acceptedSessionSpawns.length > 0 ? { acceptedSessionSpawns: current.acceptedSessionSpawns.slice() } : {}
			};
		},
		attachDeliveryEvidence(error) {
			return attachCliMessagingDeliveryEvidence(error, evidence());
		}
	};
}
//#endregion
//#region src/agents/cli-runner/model-call-diagnostics.ts
/** Trusted turn-level model-call diagnostics for the Claude Code CLI runtime. */
const MAX_CAPTURED_CONTENT_BYTES = 131072;
const FALLBACK_RESPONSE_RESERVE_BYTES = 16384;
const MAX_CAPTURED_OUTPUT_MESSAGES = 200;
const MAX_CAPTURED_OUTPUT_BLOCKS = 200;
const TRUNCATED_CONTENT_SUFFIX = "...(truncated)";
const MAX_CAPTURED_OUTPUT_STRUCTURE_BYTES = Buffer.byteLength(JSON.stringify(Array.from({ length: MAX_CAPTURED_OUTPUT_MESSAGES }, () => ({
	role: "assistant",
	content: [{
		type: "tool_call",
		name: "",
		id: ""
	}],
	stopReason: ""
}))), "utf8");
function serializedStringContentBytes(value) {
	return Buffer.byteLength(JSON.stringify(value), "utf8") - 2;
}
const TRUNCATED_CONTENT_SUFFIX_BYTES = serializedStringContentBytes(TRUNCATED_CONTENT_SUFFIX);
function truncateSerializedStringSafe(value, maxBytes) {
	if (maxBytes <= 0) return "";
	if (serializedStringContentBytes(value) <= maxBytes) return value;
	let low = 0;
	let high = Math.min(value.length, maxBytes);
	let captured = "";
	while (low <= high) {
		const middle = Math.floor((low + high) / 2);
		const candidate = truncateUtf16Safe(value, middle);
		if (serializedStringContentBytes(candidate) <= maxBytes) {
			captured = candidate;
			low = middle + 1;
		} else high = middle - 1;
	}
	return captured;
}
function releaseFallbackReserve(budget) {
	budget.remainingBytes += budget.fallbackReserveBytes;
	budget.remainingItems += budget.fallbackReserveItems;
	budget.fallbackReserveBytes = 0;
	budget.fallbackReserveItems = 0;
}
function captureTextWithinBudget(value, budget) {
	if (budget.remainingBytes <= 0) {
		budget.truncated = true;
		return;
	}
	const valueBytes = serializedStringContentBytes(value);
	if (valueBytes <= budget.remainingBytes) {
		budget.remainingBytes -= valueBytes;
		return value;
	}
	const suffix = truncateSerializedStringSafe(TRUNCATED_CONTENT_SUFFIX, budget.remainingBytes);
	const captured = `${truncateSerializedStringSafe(value, Math.max(0, budget.remainingBytes - serializedStringContentBytes(suffix)))}${suffix}`;
	budget.remainingBytes -= serializedStringContentBytes(captured);
	budget.truncated = true;
	return captured;
}
function captureBoundedText(value) {
	return captureTextWithinBudget(value, {
		remainingBytes: MAX_CAPTURED_CONTENT_BYTES,
		remainingItems: 1,
		fallbackReserveBytes: 0,
		fallbackReserveItems: 0,
		truncated: false
	}) ?? "";
}
function assistantContentBlock(block, budget) {
	if (!isRecord(block)) return;
	if (block.type === "text" && typeof block.text === "string" && block.text.length > 0) {
		const text = captureTextWithinBudget(block.text, budget);
		return text === void 0 ? void 0 : {
			type: "text",
			text
		};
	}
	if (block.type === "thinking" && typeof block.thinking === "string") {
		const thinking = captureTextWithinBudget(block.thinking, budget);
		return thinking === void 0 ? void 0 : {
			type: "thinking",
			thinking
		};
	}
	if ((block.type === "tool_use" || block.type === "server_tool_use" || block.type === "mcp_tool_use") && typeof block.name === "string") {
		const name = captureTextWithinBudget(block.name, budget);
		if (name === void 0) return;
		const id = typeof block.id === "string" ? captureTextWithinBudget(block.id, budget) : void 0;
		return {
			type: "tool_call",
			name,
			...id !== void 0 ? { id } : {}
		};
	}
}
function isCapturableAssistantContentBlock(block) {
	if (!isRecord(block)) return false;
	return block.type === "text" && typeof block.text === "string" || block.type === "thinking" && typeof block.thinking === "string" || (block.type === "tool_use" || block.type === "server_tool_use" || block.type === "mcp_tool_use") && typeof block.name === "string";
}
function isTextAssistantContentBlock(block) {
	return isRecord(block) && block.type === "text" && typeof block.text === "string" && block.text.length > 0;
}
function assistantMessageHasText(message) {
	if (!isRecord(message)) return false;
	if (typeof message.content === "string") return message.content.length > 0;
	if (!Array.isArray(message.content)) return false;
	const limit = Math.min(message.content.length, MAX_CAPTURED_OUTPUT_BLOCKS);
	for (let index = 0; index < limit; index += 1) if (isTextAssistantContentBlock(message.content[index])) return true;
	return false;
}
function normalizeClaudeAssistantMessage(message, budget) {
	if (!isRecord(message)) return;
	const content = [];
	if (typeof message.content === "string") {
		if (message.content.length === 0) return;
		releaseFallbackReserve(budget);
		const text = captureTextWithinBudget(message.content, budget);
		if (text !== void 0 && budget.remainingItems > 0) {
			content.push({
				type: "text",
				text
			});
			budget.remainingItems -= 1;
		} else if (text !== void 0) budget.truncated = true;
	} else if (Array.isArray(message.content)) {
		const sourceBlocks = message.content.slice(0, MAX_CAPTURED_OUTPUT_BLOCKS);
		if (sourceBlocks.length < message.content.length) budget.truncated = true;
		for (const [index, sourceBlock] of sourceBlocks.entries()) {
			if (isTextAssistantContentBlock(sourceBlock)) releaseFallbackReserve(budget);
			const block = assistantContentBlock(sourceBlock, budget);
			if (block) {
				if (budget.remainingItems > 0) {
					content.push(block);
					budget.remainingItems -= 1;
				} else budget.truncated = true;
			}
			if (budget.remainingBytes <= 0 || budget.remainingItems <= 0) {
				if (sourceBlocks.slice(index + 1).some(isCapturableAssistantContentBlock)) budget.truncated = true;
				break;
			}
		}
	}
	if (content.length === 0) return;
	const stopReason = typeof message.stop_reason === "string" ? captureTextWithinBudget(message.stop_reason, budget) : void 0;
	return {
		role: "assistant",
		content,
		...stopReason !== void 0 ? { stopReason } : {}
	};
}
function hasTextContent(messages) {
	return messages.some((message) => Array.isArray(message.content) && message.content.some((block) => isRecord(block) && block.type === "text" && typeof block.text === "string" && block.text.length > 0));
}
function appendOutputTruncationMarker(messages) {
	const marker = {
		type: "text",
		text: TRUNCATED_CONTENT_SUFFIX
	};
	if (messages.length < MAX_CAPTURED_OUTPUT_MESSAGES) {
		messages.push({
			role: "assistant",
			content: [marker]
		});
		return;
	}
	const lastIndex = messages.length - 1;
	const lastMessage = messages[lastIndex];
	messages[lastIndex] = {
		...lastMessage,
		content: [...Array.isArray(lastMessage?.content) ? lastMessage.content : [], marker]
	};
}
function privateData(params) {
	if (!params.modelContent && !params.errorMessage) return;
	return {
		...params.errorMessage ? { errorMessage: params.errorMessage } : {},
		...params.modelContent ? { modelContent: params.modelContent } : {}
	};
}
function failureKindForClaudeCli(error, abortSignal) {
	if (isFailoverError(error) && error.reason === "timeout") return "timeout";
	const inferred = diagnosticErrorFailureKind(error);
	if (inferred) return inferred;
	return abortSignal?.aborted ? "aborted" : void 0;
}
function usageField(usage) {
	return usage ? { usage } : {};
}
/** Creates one exactly-once Claude CLI model-call lifecycle for a prepared turn. */
function createClaudeCliModelCallDiagnostics(params) {
	if (params.context.backendResolved.id !== "claude-cli" || !areDiagnosticsEnabledForProcess() || !hasInternalDiagnosticEventListeners()) return;
	const now = params.now ?? (() => Date.now());
	const capture = resolveDiagnosticModelContentCapturePolicy(params.context.params.config ?? params.context.contextEngineConfig);
	const contextWindow = params.context.contextWindowInfo;
	const trace = freezeDiagnosticTraceContext(createDiagnosticTraceContextFromActiveScope());
	const baseFields = {
		runId: params.context.params.runId,
		callId: `${params.context.params.runId}:claude-cli:${crypto.randomUUID()}`,
		...params.context.params.sessionKey ? { sessionKey: params.context.params.sessionKey } : {},
		sessionId: params.context.params.sessionId,
		provider: params.context.backendResolved.modelProvider ?? params.context.params.modelProvider ?? "anthropic",
		model: params.context.normalizedModel,
		api: "claude-code",
		transport: params.transport,
		observationUnit: "turn",
		...contextWindow ? {
			contextTokenBudget: contextWindow.tokens,
			contextWindowSource: contextWindow.source,
			...contextWindow.referenceTokens ? { contextWindowReferenceTokens: contextWindow.referenceTokens } : {}
		} : {},
		promptStats: {
			inputMessagesCount: 1,
			inputMessagesChars: params.prompt.length,
			...params.systemPrompt ? { systemPromptChars: params.systemPrompt.length } : {},
			totalChars: params.prompt.length + (params.systemPrompt?.length ?? 0)
		},
		trace
	};
	const capturedAssistantMessages = [];
	const outputContentBudget = {
		remainingBytes: MAX_CAPTURED_CONTENT_BYTES - MAX_CAPTURED_OUTPUT_STRUCTURE_BYTES - TRUNCATED_CONTENT_SUFFIX_BYTES - FALLBACK_RESPONSE_RESERVE_BYTES,
		remainingItems: 198,
		fallbackReserveBytes: FALLBACK_RESPONSE_RESERVE_BYTES,
		fallbackReserveItems: 1,
		truncated: false
	};
	let started = false;
	let terminalEmitted = false;
	let startedAt = 0;
	let requestPayloadBytes;
	let responseStreamBytes = 0;
	let firstCliOutputAt;
	let observedUsage;
	let observedTerminalUsage;
	const baseModelContent = () => {
		if (!capture.anyModelContent) return;
		const content = {
			...capture.inputMessages ? { inputMessages: cloneDiagnosticContentValue([{
				role: "user",
				content: [{
					type: "text",
					text: captureBoundedText(params.prompt)
				}]
			}]) } : {},
			...capture.systemPrompt && params.systemPrompt ? { systemPrompt: captureBoundedText(params.systemPrompt) } : {}
		};
		return Object.keys(content).length > 0 ? content : void 0;
	};
	const outputMessages = (output) => {
		const messages = capturedAssistantMessages.slice();
		const responseText = output?.rawText ?? output?.text;
		if (!hasTextContent(messages) && responseText && messages.length < MAX_CAPTURED_OUTPUT_MESSAGES) {
			const fallback = normalizeClaudeAssistantMessage({ content: responseText }, outputContentBudget);
			if (fallback) messages.push(fallback);
		}
		if (outputContentBudget.truncated) appendOutputTruncationMarker(messages);
		return cloneDiagnosticContentValue(messages);
	};
	const completedModelContent = (output) => {
		const base = baseModelContent();
		if (!capture.outputMessages) return base;
		return {
			...base,
			outputMessages: outputMessages(output)
		};
	};
	const sizeTimingFields = () => ({
		...requestPayloadBytes !== void 0 ? { requestPayloadBytes } : {},
		...responseStreamBytes > 0 ? { responseStreamBytes } : {},
		...firstCliOutputAt !== void 0 ? { timeToFirstByteMs: Math.max(0, firstCliOutputAt - startedAt) } : {}
	});
	return {
		emitStarted: () => {
			if (started) return;
			started = true;
			startedAt = now();
			emitTrustedDiagnosticEventWithPrivateData({
				type: "model.call.started",
				...baseFields
			}, privateData({ modelContent: baseModelContent() }));
		},
		observeRequestPayload: (payload) => {
			requestPayloadBytes = Buffer.byteLength(payload, "utf8");
		},
		observeCliOutput: (chunk, stream, knownByteLength) => {
			if (!chunk) return;
			firstCliOutputAt ??= now();
			if (stream === "stdout") responseStreamBytes += knownByteLength ?? Buffer.byteLength(chunk, "utf8");
		},
		observeAssistantMessage: (message) => {
			if (!capture.outputMessages || (outputContentBudget.remainingBytes <= 0 || outputContentBudget.remainingItems <= 0) && !(outputContentBudget.fallbackReserveItems > 0 && assistantMessageHasText(message)) || capturedAssistantMessages.length >= 199) {
				if (capture.outputMessages) outputContentBudget.truncated = true;
				return;
			}
			const normalized = normalizeClaudeAssistantMessage(message, outputContentBudget);
			if (normalized) capturedAssistantMessages.push(normalized);
		},
		observeUsage: (usage, terminal) => {
			observedUsage = usage;
			if (terminal) observedTerminalUsage = usage;
		},
		emitCompleted: (output) => {
			if (!started || terminalEmitted) return;
			terminalEmitted = true;
			emitTrustedDiagnosticEventWithPrivateData({
				type: "model.call.completed",
				...baseFields,
				durationMs: Math.max(0, now() - startedAt),
				...sizeTimingFields(),
				...usageField(output.diagnosticUsage ?? observedTerminalUsage ?? output.usage ?? observedUsage)
			}, privateData({ modelContent: completedModelContent(output) }));
		},
		emitError: (error) => {
			if (!started || terminalEmitted) return;
			terminalEmitted = true;
			const failureKind = failureKindForClaudeCli(error, params.context.params.abortSignal);
			emitTrustedDiagnosticEventWithPrivateData({
				type: "model.call.error",
				...baseFields,
				durationMs: Math.max(0, now() - startedAt),
				errorCategory: (isFailoverError(error) ? error.reason : void 0) ?? failureKind ?? diagnosticErrorCategory(error),
				...failureKind ? { failureKind } : {},
				...sizeTimingFields(),
				...usageField(observedTerminalUsage ?? observedUsage)
			}, privateData({
				modelContent: completedModelContent(),
				errorMessage: diagnosticErrorMessage(error)
			}));
		}
	};
}
//#endregion
//#region src/agents/cli-runner/execute.ts
/** Executes prepared CLI backend runs and owns their queue and resource lifecycle. */
function normalizeCliBackendThinkingLevel(level) {
	return level === "ultra" ? "max" : level;
}
function exactToolAvailabilityError(params) {
	if (!params.isolatedCompletion) return new Error(params.message);
	const error = new Error(params.message);
	error.name = "IsolatedCompletionRuntimeError";
	error.code = params.code;
	return error;
}
function assertExactToolAvailabilityRuntimeVersion(params) {
	const artifact = params.executableIdentity?.runtimeArtifact;
	const packageVersion = artifact?.kind === "package-tree" ? artifact.packageVersion : void 0;
	const parsedVersion = packageVersion ? parse(packageVersion) : null;
	const prereleaseChannel = parsedVersion?.prerelease[0];
	const minimumVersion = parsedVersion?.prerelease.length === 0 ? params.policy?.stableMinimum : typeof prereleaseChannel === "string" ? params.policy?.prereleaseMinimums?.[prereleaseChannel] : void 0;
	const comparison = packageVersion && minimumVersion ? compareValidSemver(packageVersion, minimumVersion) : null;
	if (comparison !== null && comparison >= 0) return;
	throw exactToolAvailabilityError({
		code: "unsupported",
		isolatedCompletion: params.isolatedCompletion,
		message: `CLI backend ${params.backendId} requires a supported package version for exact per-run tool availability${minimumVersion ? ` (requires >=${minimumVersion}` : " (unsupported release line"}${packageVersion ? `; found ${packageVersion})` : ")"}`
	});
}
/** Executes a prepared CLI run context and returns normalized CLI output. */
async function executePreparedCliRun(inputContext, cliSessionIdToUse, options) {
	const context = !cliSessionIdToUse && inputContext.openClawHistoryPrompt && inputContext.cliHistoryWriter ? {
		...inputContext,
		params: {
			...inputContext.params,
			assertCurrent: inputContext.cliHistoryWriter.assertReadable
		}
	} : inputContext;
	const params = context.params;
	const assertCurrent = createCliRunCurrentAssertion(params);
	assertCurrent();
	const backend = context.preparedBackend.backend;
	const executionTarget = context.executionTarget;
	const localProcessEnv = installationTargetEnv(getInstallationTarget());
	if (localProcessEnv && executionTarget.kind === "node") throw new Error(LOCAL_INSTALLATION_TARGET_UNSUPPORTED);
	const nodePlacement = executionTarget.kind === "node" ? executionTarget.placement : null;
	const usePluginOwnedExecution = executionTarget.kind === "plugin";
	const { sessionId: resolvedSessionId, isNew } = resolveSessionIdToSend({
		backend,
		cliSessionId: cliSessionIdToUse
	});
	const useResume = Boolean(cliSessionIdToUse && resolvedSessionId && backend.resumeArgs && backend.resumeArgs.length > 0);
	const resendSystemPromptForSoftResume = context.reusableCliSession.mode === "reuse-with-drift";
	const systemPromptArg = resolveSystemPromptUsage({
		backend,
		isNewSession: isNew || resendSystemPromptForSoftResume,
		systemPrompt: context.systemPrompt
	});
	const shouldSendSystemPrompt = systemPromptArg && (!useResume || backend.systemPromptWhen === "always" || resendSystemPromptForSoftResume);
	const systemPromptFile = !nodePlacement && !usePluginOwnedExecution && shouldSendSystemPrompt ? await executeDeps.writeCliSystemPromptFile({
		backend,
		systemPrompt: systemPromptArg
	}) : void 0;
	const nodeSystemPrompt = nodePlacement && shouldSendSystemPrompt ? systemPromptArg : void 0;
	const basePrompt = cliSessionIdToUse ? params.prompt : context.openClawHistoryPrompt ?? params.prompt;
	let prompt = params.controlOperation !== void 0 ? basePrompt : applyPluginTextReplacements(basePrompt, context.backendResolved.textTransforms?.input);
	const promptContext = context.promptContext ? {
		...context.promptContext.prependContext ? { prependContext: applyPluginTextReplacements(context.promptContext.prependContext, context.backendResolved.textTransforms?.input) } : {},
		...context.promptContext.appendContext ? { appendContext: applyPluginTextReplacements(context.promptContext.appendContext, context.backendResolved.textTransforms?.input) } : {}
	} : void 0;
	if (nodePlacement && ((params.images?.length ?? 0) > 0 || (params.mediaImageLayout ? params.mediaImageLayout.slots.length > 0 : hasHydratableMediaImages(params.media)) || (params.imagePrompt ? detectImageReferences(params.imagePrompt).length > 0 : false))) throw new Error("paired-node Claude CLI sessions do not support attachments or images");
	const imageTurnEntryId = isClaudeCliBackendId(context.backendResolved.id) ? params.userTurnTranscriptRecorder?.getAdmissionReceipt()?.entryId : void 0;
	const imagePayload = nodePlacement ? {
		prompt,
		imagePaths: [],
		cleanupImages: async () => {}
	} : await prepareCliPromptImagePayload({
		backend,
		prompt,
		imagePrompt: params.imagePrompt,
		workspaceDir: context.workspaceDir,
		localRoots: getAgentScopedMediaLocalRoots(params.config ?? {}, params.agentId),
		images: params.images,
		imageOrder: params.imageOrder,
		mediaImageLayout: params.mediaImageLayout,
		media: params.media,
		...imageTurnEntryId ? { imageTurnKey: hashCliImageTurnEntryId(imageTurnEntryId) } : {}
	});
	prompt = imagePayload.prompt;
	const promptInputBackend = params.controlOperation === "compact" && context.backendResolved.manualCompaction ? {
		...backend,
		input: context.backendResolved.manualCompaction.input
	} : backend;
	const { argsPrompt, stdin } = resolvePromptInput({
		backend: promptInputBackend,
		prompt
	});
	const baseArgs = useResume ? backend.resumeArgs ?? backend.args ?? [] : backend.args ?? [];
	const resolvedArgs = useResume ? baseArgs.map((entry) => entry.replaceAll("{sessionId}", resolvedSessionId ?? "")) : baseArgs;
	const baseArgsWithSkills = !nodePlacement && context.claudeSkillsPluginArgs.length > 0 ? [...resolvedArgs, ...context.claudeSkillsPluginArgs] : resolvedArgs;
	const cliLiveOwnerKey = buildCliLiveOwnerKey({
		agentAccountId: params.agentAccountId,
		agentId: params.agentId,
		authProfileId: context.effectiveAuthProfileId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey
	});
	const queueKey = resolveCliRunQueueKey({
		backendId: context.backendResolved.id,
		liveSession: backend.liveSession,
		serialize: backend.serialize,
		runId: params.runId,
		workspaceDir: context.workspaceDir,
		cliSessionId: useResume ? resolvedSessionId : void 0,
		ownerKey: cliLiveOwnerKey
	});
	const useManagedClaudeLiveSession = usePluginOwnedExecution && acceptsCliLiveSession(context) && !params.onSuccessfulAuthBinding;
	const diagnostics = createClaudeCliModelCallDiagnostics({
		context,
		prompt: composeCliPromptContext(prompt, promptContext),
		systemPrompt: systemPromptArg ?? void 0,
		transport: nodePlacement ? "paired-node-cli" : useManagedClaudeLiveSession ? "stdio-live" : "stdio"
	});
	let completedOutput;
	let executionError;
	let outerCleanupError;
	let forkResumeClaimed = false;
	let forkSuccessorObserved = false;
	let forkSuccessorPersistence;
	const observeForkSuccessor = (sessionId) => {
		if (forkSuccessorObserved || !forkResumeClaimed || !resolvedSessionId || sessionId === resolvedSessionId) return;
		forkSuccessorObserved = true;
		forkSuccessorPersistence = params.persistCliSessionForkSuccessor?.(sessionId);
		forkSuccessorPersistence?.catch(() => void 0);
	};
	const finishForkSuccessorPersistence = async () => {
		try {
			await forkSuccessorPersistence;
		} catch (error) {
			forkSuccessorObserved = false;
			throw error;
		}
	};
	const cleanupOuterResource = async (cleanup) => {
		try {
			await runCliCleanup(params, "cli-outer-resource", async () => {
				await cleanup?.();
			});
		} catch (error) {
			if (completedOutput?.didSendViaMessagingTool) {
				cliBackendLog.warn(`CLI outer resource cleanup failed after confirmed message delivery: ${formatErrorMessage(error)}`);
				return;
			}
			if (executionError !== void 0) {
				cliBackendLog.warn(`CLI outer resource cleanup also failed after run error: ${formatErrorMessage(error)}`);
				return;
			}
			throw error;
		}
	};
	const executeAttempt = async () => {
		assertCurrent();
		await context.preparedBackend.beforeExecution?.();
		assertCurrent();
		const cliTurnStartedAt = Date.now();
		const restoreSkillEnv = params.skillsSnapshot && !params.controlOperation ? applySkillEnvOverridesFromSnapshot({
			snapshot: params.skillsSnapshot,
			config: params.config
		}) : void 0;
		let cleanupMcpCaptureAttempt;
		let runOutput;
		let runError;
		let runFailed = false;
		const recordRunError = (error) => {
			if (!runFailed) {
				runFailed = true;
				runError = error;
			}
		};
		const toolTracking = createCliToolTracking(context);
		const events = createCliEventHandlers({
			context,
			toolTracking,
			getRunState: () => ({
				failed: runFailed,
				error: runError
			})
		});
		try {
			cliBackendLog.info(buildCliExecLogLine({
				provider: params.provider,
				model: context.normalizedModel,
				promptChars: basePrompt.length,
				trigger: params.trigger,
				useResume,
				cliSessionId: cliSessionIdToUse,
				resolvedSessionId,
				reusableSession: context.reusableCliSession,
				hasHistoryPrompt: Boolean(context.openClawHistoryPrompt)
			}));
			const logOutputText = isTruthyEnvValue(process.env[CLI_BACKEND_LOG_OUTPUT_ENV]);
			const outputMode = useResume ? backend.resumeOutput ?? backend.output : backend.output;
			const initialGatewayCaptureKey = nodePlacement || !context.mcpDeliveryCapture ? void 0 : crypto.randomUUID();
			const mcpCaptureAttempt = nodePlacement ? {
				env: {},
				cleanup: void 0
			} : await prepareCliBundleMcpCaptureAttempt({
				mode: context.backendResolved.bundleMcpMode,
				backend,
				env: context.preparedBackend.env,
				captureKey: initialGatewayCaptureKey
			});
			cleanupMcpCaptureAttempt = mcpCaptureAttempt.cleanup;
			const preparedBackendEnv = context.preparedBackend.env ?? {};
			const selectedClaudeClearEnv = Boolean(context.preparedBackend.secretInput) || [...CLAUDE_SELECTED_AUTH_ENV_KEYS].some((key) => Object.hasOwn(preparedBackendEnv, key)) ? new Set(backend.clearEnv ?? []) : void 0;
			const backendEnv = {
				...Object.fromEntries(Object.entries(backend.env ?? {}).filter(([key]) => !selectedClaudeClearEnv?.has(key))),
				...preparedBackendEnv
			};
			const nodeEnvEntries = Object.entries(preparedBackendEnv).filter(([key]) => NODE_CLAUDE_FORWARD_ENV_KEYS.has(key));
			const nodeEnv = nodePlacement ? {
				...Object.fromEntries(nodeEnvEntries),
				...resolveNodeClaudeAuthEnv(context)
			} : void 0;
			const nodeRuntimeClearEnv = nodePlacement ? [...NODE_CLAUDE_FORWARD_ENV_KEYS].filter((key) => backend.clearEnv?.includes(key)) : [];
			const nodeClearEnv = [...selectedClaudeClearEnv ?? [], ...nodeRuntimeClearEnv].filter((key, index, values) => values.indexOf(key) === index);
			const env = sanitizeHostExecEnv({
				baseEnv: process.env,
				blockPathOverrides: true
			});
			const preservedEnv = parseCliBackendPreserveEnv(process.env[CLI_BACKEND_PRESERVE_ENV]);
			for (const key of backend.clearEnv ?? []) if (!preservedEnv.has(key) || selectedClaudeClearEnv?.has(key)) delete env[key];
			if (Object.keys(backendEnv).length > 0) Object.assign(env, sanitizeHostExecEnv({
				baseEnv: {},
				overrides: backendEnv,
				blockPathOverrides: true
			}));
			Object.assign(env, mcpCaptureAttempt.env, localProcessEnv);
			delete env.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST;
			let executionCommand = backend.command;
			let executionArgv0;
			let executionLeadingArgv = [];
			context.runtimeOwnerFingerprint = void 0;
			context.runtimeArtifactFingerprint = void 0;
			const exactToolAvailabilityVersionPolicy = params.cliToolAvailability ? context.backendResolved.runtimeArtifact?.exactToolAvailabilityVersionPolicy : void 0;
			if (exactToolAvailabilityVersionPolicy && nodePlacement) throw exactToolAvailabilityError({
				code: "unsupported",
				isolatedCompletion: params.isolatedCompletion === true,
				message: `CLI backend ${context.backendResolved.id} cannot verify its exact tool-availability runtime on a paired node`
			});
			if ((params.onSuccessfulAuthBinding || exactToolAvailabilityVersionPolicy) && !nodePlacement) {
				const executableIdentity = await resolveCliExecutableIdentity({
					command: backend.command,
					cwd: context.cwd ?? context.workspaceDir,
					env,
					...context.backendResolved.runtimeArtifact ? { runtimeArtifact: context.backendResolved.runtimeArtifact } : {}
				});
				if (!executableIdentity) throw exactToolAvailabilityError({
					code: "runtime-unavailable",
					isolatedCompletion: params.isolatedCompletion === true && exactToolAvailabilityVersionPolicy !== void 0,
					message: `CLI backend ${context.backendResolved.id} executable cannot be bound to one durable absolute owner`
				});
				if (exactToolAvailabilityVersionPolicy) assertExactToolAvailabilityRuntimeVersion({
					backendId: context.backendResolved.id,
					policy: exactToolAvailabilityVersionPolicy,
					executableIdentity,
					isolatedCompletion: params.isolatedCompletion === true
				});
				executionCommand = executableIdentity.invocation.command;
				executionArgv0 = executableIdentity.invocation.argv0;
				executionLeadingArgv = executableIdentity.invocation.leadingArgv;
				context.runtimeArtifactFingerprint = fingerprintCliRuntimeArtifact({
					provider: params.provider,
					backendId: context.backendResolved.id,
					executableIdentity
				});
				if (params.onSuccessfulAuthBinding && !context.authBindingFingerprint) context.runtimeOwnerFingerprint = await resolveCliRuntimeOwnerFingerprint({
					provider: params.provider,
					config: params.config ?? context.contextEngineConfig,
					...context.agentDir ? { agentDir: context.agentDir } : {},
					agentId: params.agentId,
					runtimeOwnerId: context.backendResolved.id,
					...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
					...context.authBindingSkipsLocalCredential ? { skipLocalCredential: true } : {},
					runtimeArtifactFingerprint: context.runtimeArtifactFingerprint
				});
			}
			const resolveExecutionArgs = () => {
				assertCurrent();
				const resolvedExecutionArgs = context.backendResolved.resolveExecutionArgs?.({
					config: params.config,
					workspaceDir: context.workspaceDir,
					provider: params.provider,
					modelId: context.modelId,
					authProfileId: context.effectiveAuthProfileId,
					thinkingLevel: normalizeCliBackendThinkingLevel(params.thinkLevel),
					fastMode: params.fastMode === void 0 ? void 0 : resolveFastModeForElapsed({
						mode: params.fastMode,
						startedAtMs: params.fastModeStartedAtMs ?? context.started,
						fastAutoOnSeconds: params.fastModeAutoOnSeconds
					}).enabled,
					executionMode: params.executionMode ?? "agent",
					toolAvailability: params.cliToolAvailability && nodePlacement ? {
						native: params.cliToolAvailability.native,
						openClaw: []
					} : params.cliToolAvailability,
					useResume,
					baseArgs: baseArgsWithSkills
				});
				if (params.cliToolAvailability && context.backendResolved.toolAvailabilityEnforcement === "execution-args" && !resolvedExecutionArgs) throw new Error(`CLI backend ${context.backendResolved.id} did not enforce exact per-run tool availability`);
				const executionBaseArgs = nodePlacement ? stripGatewayLocalClaudeArgs(resolvedExecutionArgs ?? baseArgsWithSkills) : resolvedExecutionArgs ?? baseArgsWithSkills;
				const args = buildCliArgs({
					backend: nodePlacement ? {
						...backend,
						systemPromptArg: void 0,
						systemPromptFileArg: void 0
					} : backend,
					baseArgs: Array.from(executionBaseArgs),
					modelId: context.normalizedModel,
					sessionId: resolvedSessionId,
					systemPrompt: nodePlacement || usePluginOwnedExecution ? void 0 : systemPromptArg,
					systemPromptFilePath: systemPromptFile?.filePath,
					imagePaths: imagePayload.imagePaths,
					promptArg: argsPrompt,
					useResume,
					forkResume: params.forkCliSessionOnResume,
					resumeAt: params.cliSessionResumeAt,
					sendSystemPromptOnResume: resendSystemPromptForSoftResume
				});
				if (logOutputText) logCliInvocation({
					args,
					command: executionCommand,
					env,
					systemPromptArg: backend.systemPromptArg,
					modelArg: backend.modelArg,
					imageArg: backend.imageArg,
					argsPrompt,
					log: (message) => cliBackendLog.info(message)
				});
				return args;
			};
			const runTimeoutOverrideMs = resolveCliRunTimeoutOverrideMs({
				config: params.config,
				lane: params.lane,
				timeoutMs: params.timeoutMs,
				runTimeoutOverrideMs: params.runTimeoutOverrideMs
			});
			const noOutputTimeoutMs = resolveCliNoOutputTimeoutMs({
				backend,
				timeoutMs: params.timeoutMs,
				expectedQuiet: params.controlOperation === "compact",
				runTimeoutOverrideMs,
				useResume,
				trigger: params.trigger
			});
			runOutput = await executeCliProcess({
				context,
				assertCurrent,
				backend,
				deps: executeDeps,
				events,
				toolTracking,
				diagnostics,
				nodePlacement,
				nodeSystemPrompt,
				nodeEnv: nodeEnv && Object.keys(nodeEnv).length > 0 ? nodeEnv : void 0,
				nodeClearEnv: nodeClearEnv.length > 0 ? nodeClearEnv : void 0,
				useManagedClaudeLiveSession,
				initialGatewayCaptureKey,
				useResume,
				cliSessionIdToUse,
				resolvedSessionId,
				executionCommand,
				executionArgv0,
				executionLeadingArgv,
				resolveExecutionArgs,
				env,
				prompt,
				...promptContext ? { promptContext } : {},
				argsPrompt,
				stdin,
				noOutputTimeoutMs,
				outputMode,
				logOutputText,
				cliTurnStartedAt,
				observeForkSuccessor,
				options
			});
		} catch (error) {
			recordRunError(error);
		} finally {
			await toolTracking.finishDeliveryTracking({
				useManagedClaudeLiveSession,
				recordRunError
			});
			toolTracking.finalizeCapture(events.finalizeParsedTools);
			try {
				await runCliCleanup(params, "cli-mcp-capture", async () => {
					await cleanupMcpCaptureAttempt?.();
				});
			} catch (error) {
				recordRunError(error);
			}
			try {
				await runCliCleanup(params, "cli-skill-env", async () => {
					restoreSkillEnv?.();
				});
			} catch (error) {
				recordRunError(error);
			}
		}
		if (runFailed) throw toolTracking.attachDeliveryEvidence(runError);
		if (!runOutput) throw new Error("CLI run completed without output");
		return toolTracking.withExecutionEvidence({
			...runOutput,
			toolSummary: events.getToolSummary()
		});
	};
	try {
		completedOutput = await enqueueCliRun(queueKey, () => {
			const runQueuedAttempt = async () => {
				assertCurrent();
				if (params.lifecycleGeneration) assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
				diagnostics?.emitStarted();
				if (params.forkCliSessionOnResume && useResume) {
					if (!params.persistCliSessionForkSuccessor) throw new Error("CLI session fork successor persistence is unavailable");
					forkResumeClaimed = await params.claimCliSessionFork?.() === true;
					if (!forkResumeClaimed) throw new Error("CLI session fork marker is no longer available");
					await restartCliLiveSession(context);
				}
				return await executeAttempt();
			};
			const consumer = context.pluginExecutionConsumer;
			return consumer ? consumer.run(runQueuedAttempt) : runQueuedAttempt();
		});
		if (completedOutput.sessionId) observeForkSuccessor(completedOutput.sessionId);
		await finishForkSuccessorPersistence();
		if (forkResumeClaimed && !forkSuccessorObserved) {
			await params.restoreCliSessionFork?.();
			forkResumeClaimed = false;
			throw new Error("forked CLI session did not report a successor session id");
		}
	} catch (error) {
		executionError = error;
		diagnostics?.emitError(error);
		let failure = error;
		try {
			await finishForkSuccessorPersistence();
		} catch (persistenceError) {
			failure = new AggregateError([error, persistenceError], "CLI turn failed and its fork successor could not be persisted", { cause: error });
		}
		if (forkResumeClaimed && !forkSuccessorObserved) await params.restoreCliSessionFork?.();
		throw failure;
	} finally {
		try {
			await cleanupOuterResource(systemPromptFile?.cleanup);
			await cleanupOuterResource(imagePayload.cleanupImages);
		} catch (error) {
			outerCleanupError = toErrorObject(error, "CLI outer resource cleanup failed");
		}
	}
	if (outerCleanupError) {
		options?.onPhase?.("cleanup");
		diagnostics?.emitError(outerCleanupError);
		throw outerCleanupError;
	}
	if (!completedOutput) {
		const error = /* @__PURE__ */ new Error("CLI run completed without output");
		diagnostics?.emitError(error);
		throw error;
	}
	diagnostics?.emitCompleted(completedOutput);
	return completedOutput;
}
//#endregion
export { executePreparedCliRun as t };
