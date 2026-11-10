import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { N as resolveOptionalIntegerOption, a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs, s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { E as createDiagnosticTraceContextFromActiveScope, I as markToolExecutionLivenessDiagnosticEvent, J as hasInternalDiagnosticEventListeners, O as freezeDiagnosticTraceContext, c as emitTrustedDiagnosticEventWithPrivateData, s as emitTrustedDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { c as sanitizeHostExecEnv } from "./host-env-security-D0hvR517.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.mjs";
import { i as withChildProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { o as resolveExecutablePath } from "./executable-path-hXcbMo0b.mjs";
import { u as getAgentRunContext, x as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-gmaPgO-n.mjs";
import { a as emitAgentEvent, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { d as runWithSessionSourceScope, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { _ as resolveAdmittedRunActiveAssertion, u as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { t as NODE_AGENT_CLI_CLAUDE_RUN_COMMAND } from "./node-commands-Bxo-2Y4j.mjs";
import { n as FailoverError, o as isFailoverError, s as isSignalTimeoutReason, t as CLI_PARTIAL_OUTPUT_REJECTED_ERROR_CODE } from "./error-Bcp4ZyOv.mjs";
import { h as resolveCliToolTerminalReason } from "./run-termination-Dwf1ksjA.mjs";
import { r as captureSessionEventTargetForHost, t as enqueueSessionEventForHost } from "./session-event-handoff-BLWR3ywE.mjs";
import { f as withGatewayToolCallerIdentity, o as getGatewayToolCallerIdentity, r as createAdmittedGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { i as createCapturedOutputBuffers, n as appendCapturedOutput } from "./exec-output-BwHZLgmD.mjs";
import { t as applyPluginTextReplacements } from "./plugin-text-transforms-B25e5LoI.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-XVSoVbNQ.mjs";
import { _ as runBeforeToolCallHook, o as recordAdjustedParamsForToolCall } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { E as withAgentQuestionAnswerAuthority } from "./host-private-capabilities-eTr803c9.mjs";
import { l as resolveFastModeForElapsed } from "./fast-mode-smSVCJXN.mjs";
import "./fast-mode-DezNRstT.mjs";
import { t as resolveExecApprovalsFromFileInternal } from "./exec-approvals-resolver-BYbI_zvO.mjs";
import { l as readExecApprovalsSnapshotAsync } from "./exec-approvals-store-BhzM_h1C.mjs";
import { n as evaluateShellAllowlistWithAuthorization } from "./exec-approvals-allowlist-CzbwiW56.mjs";
import { i as recordAllowlistMatchesUse } from "./exec-approvals-ByI8H66l.mjs";
import { r as mergePathPrepend } from "./path-prepend-D21kYd3c.mjs";
import { i as resolveWindowsExecutablePath, o as resolveWindowsSpawnProgramCandidate } from "./windows-spawn-BwP7BByc.mjs";
import { t as getProcessSupervisor } from "./supervisor-BxKhxTp_.mjs";
import { s as runWithAgentToolSourceExecutionScope } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import { n as resolveEventSessionRoutingPolicy, t as resolveEventSessionKeyForPolicy } from "./event-session-routing-TMTpLGFx.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import { a as readToolResultDetails } from "./tool-result-error-IpvGgAny.mjs";
import { i as resolveExecDefaultsAsync } from "./exec-defaults-DrIV-0KT.mjs";
import { l as withMessageInjectionAdmission, t as MessageInjectionAcceptedUnconfirmedError } from "./message-injection-authority-Mu3hgByB.mjs";
import { g as beginDiagnosticBackendActivity, v as BLOCKED_TOOL_CALL_ABORT_FLOOR_MS } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy, t as cloneDiagnosticContentValue } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { t as classifyFailoverReason } from "./classify-PIr_bdgF.mjs";
import { m as resolveFailoverStatus } from "./failover-error-Bjf0VdY2.mjs";
import { i as enqueueCommandInLane } from "./command-queue-Dvag6gVL.mjs";
import { a as sanitizeExecApprovalWarningTextWithStatus, t as exceedsApprovalTextLimit } from "./exec-approval-text-sanitize-pO0fnlnc.mjs";
import { n as projectAgentActivityItem } from "./agent-activity-presentation-0UzpmALS.mjs";
import { n as isAgentPlanProgressToolName } from "./progress-card-input-Cjgdy85s.mjs";
import { n as getInstallationTarget, r as installationTargetEnv, t as LOCAL_INSTALLATION_TARGET_UNSUPPORTED } from "./installation-target-context-B9ZDUs_O.mjs";
import { n as applySkillEnvOverridesFromSnapshot } from "./env-overrides-BfZsWBmC.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-B-x-73co.mjs";
import "./embedded-agent-helpers-CRUmVsjM.mjs";
import { n as diagnosticErrorFailureKind, r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-Dt79CD6m.mjs";
import { l as truncatePluginApprovalDetail, t as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS } from "./plugin-approvals-CNVcvn9G.mjs";
import { t as callGatewayTool } from "./gateway-BC8tozR0.mjs";
import { a as isMessagingToolTargetEvidenceAction, i as isMessagingToolSendAction, n as isMessagingTool, r as isMessagingToolDeliveryAction } from "./embedded-agent-messaging-BHfhPlTk.mjs";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-C0CV-oid.mjs";
import { a as resolveQuestionTimeoutMs } from "./ask-user-tool-normalization-Cqh2rKIa.mjs";
import { l as readSessionWorkerPlacementAsync } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { r as projectAgentToolActivity } from "./agent-activity-events-D7azORwm.mjs";
import { c as prepareSystemRunMutableFileBinding, u as revalidateSystemRunMutableFileBinding } from "./system-run-approval-binding-DJ0HBEkx.mjs";
import { n as resolveExecToolConfig } from "./lazy-exec-tool-6rMYuHYl.mjs";
import { t as createNodeDuplexEndpoint } from "./node-duplex-framing-2GJEV9Zb.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CCKsZy54.mjs";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-BJoXx6GG.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-uCpxGkcu.mjs";
import { c as readEmbeddedMessageDeliveryFact } from "./embedded-agent-message-delivery-DeQ0PPQm.mjs";
import { t as shouldUseInternalSourceReplySink } from "./internal-source-reply-C7oFTNdx.mjs";
import { t as createModelCallStreamProgressReporter } from "./diagnostic-model-stream-progress-BZzbtql4.mjs";
import { i as normalizeAcceptedSessionSpawnResult } from "./accepted-session-spawn-Bo7jgCE_.mjs";
import { i as resolveRegisteredExecApprovalDecision, r as registerExecApprovalRequestForHostOrThrow } from "./bash-tools.exec-approval-request-DW9OyqdR.mjs";
import { t as hasHydratableMediaImages } from "./images.media-refs-CKLFlAQM.mjs";
import { r as detectImageReferences } from "./images-BQVTsQiw.mjs";
import { a as isDeliveredMessagingToolSendToCurrentSource, n as extractMessagingToolSendResult, r as extractMessagingToolSourceReplyPayload, t as extractMessagingToolSend } from "./embedded-agent-messaging-extraction-DjEst-db.mjs";
import { i as resolveMessageToolSourceReplyFinal, n as isDeliveredMessagingToolResult, t as isDeliveredMessageToolOnlySourceReplyResult } from "./embedded-agent-message-tool-source-reply-CiWOpEbo.mjs";
import { t as projectProgressCardChannelUpdate } from "./progress-card-channel-summary-dxOwRAaX.mjs";
import { c as prepareToolResult, i as extractToolErrorMessage } from "./embedded-agent-tool-results-0KH5a_sR.mjs";
import { i as filterToolResultMediaUrls, n as collectMessagingMediaUrlsFromToolResult, r as extractToolResultMediaArtifact, t as collectMessagingMediaUrlsFromRecord } from "./embedded-agent-tool-media-BiXZn9vg.mjs";
import { r as stripOpenClawMcpToolPrefix, t as normalizeCliToolName } from "./tool-policy-tVbJkh67.mjs";
import { t as createPluginToolsMcpHandlers } from "./plugin-tools-handlers-C-LYSw5H.mjs";
import { a as resolveCliRuntimeOwnerFingerprint, o as resolveCliExecutableIdentity, t as fingerprintCliRuntimeArtifact } from "./cli-auth-epoch-DfSBzPUX.mjs";
import { c as encodeNodeClaudeSkillMessage, i as NODE_CLAUDE_WORKSHOP_RESULT_BYTES, n as NODE_CLAUDE_SKILLS_MESSAGE_BYTES, o as NodeClaudeSkillUpstreamSchema } from "./node-claude-skill-protocol-50YRelMc.mjs";
import { n as prepareSkillResourceDelivery } from "./resources-B8SeIb4_.mjs";
import { t as buildAuthorizedShellCommandFromPlan } from "./exec-authorization-render-Cus3zbPg.mjs";
import { n as hashCliImageTurnEntryId } from "./cli-image-turn-correlation-BVXO9f3I.mjs";
import { n as cliBackendLog, r as formatCliBackendOutputDigest, t as CLI_BACKEND_LOG_OUTPUT_ENV } from "./log-wVbGxCir.mjs";
import { c as resolvePromptInput, d as writeCliSystemPromptFile, i as isClaudeCliBackendId, l as resolveSessionIdToSend, n as buildCliArgs, o as prepareCliPromptImagePayload, s as resolveCliRunQueueKey, u as resolveSystemPromptUsage } from "./helpers-pkXnPWuP.mjs";
import { i as isCurrentPlacementTurnClaim } from "./placement-record-CBaaHws5.mjs";
import { n as CLI_RESUME_WATCHDOG_DEFAULTS, r as CLI_WATCHDOG_MIN_TIMEOUT_MS, t as CLI_FRESH_WATCHDOG_DEFAULTS } from "./cli-watchdog-defaults-CzmnkdzO.mjs";
import { r as compileStructuredInputQuestions } from "./structured-input-2YWwqZbm.mjs";
import { t as runStructuredInput } from "./structured-input-execution-ByqNPx3z.mjs";
import { a as prepareCliBundleMcpCaptureAttempt, t as composeCliPromptContext } from "./prompt-context-Cdevq6tT.mjs";
import { a as getCliLiveSessionApprovalGrants, b as createCliRunCurrentAssertion, c as restartCliLiveSession, d as resolveCliResumeAtError, f as formatCliOutputError, g as isClaudeForegroundAgentToolName, h as transformCliResultText, i as createCliLiveSessionCapability, l as createCliExitFailoverError, m as createCliJsonlStreamingParser, n as buildCliLiveOwnerKey, p as parseCliOutput, r as closeCliLiveSession, t as acceptsCliLiveSession, u as createCliFailoverError, w as runCliCleanup, y as attachCliReplyBackend } from "./cli-live-session-registry-dDPsvSOh.mjs";
import { t as resolveCliSessionId } from "./cli-run-recovery-uVHzVd4q.mjs";
import { t as buildMcpToolSchema } from "./mcp-http.schema-DD_OLJv3.mjs";
import { i as cliAssistantItemId, r as projectCliMessagingDeliveryEvidence, t as attachCliMessagingDeliveryEvidence } from "./delivery-evidence-hMWnlfMU.mjs";
import { g as waitForMcpLoopbackToolCallCaptureIdle, r as clearMcpLoopbackToolCallCapture, t as beginMcpLoopbackToolCallCapture } from "./mcp-http.loopback-runtime-DxTYlVrU.mjs";
import crypto, { randomUUID } from "node:crypto";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
import { parse as parse$1 } from "semver";
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
	const sessionKey = run.sessionKey;
	const sessionScope = {
		sessionKey,
		agentId: run.agentId,
		storePath: run.storePath,
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	};
	const connectionId = node.connId;
	const pairingGeneration = node.pairingGeneration;
	const caller = getGatewayToolCallerIdentity();
	const memory = captureSessionEntryMetadataRead(sessionScope, assertRun);
	let sourceActive = true;
	let retained;
	let unregisterSource = () => {};
	const releaseSource = async () => {
		sourceActive = false;
		retained?.release();
		unregisterSource();
	};
	const readSession = async () => memory ? memory.readCurrent() : await withSessionEntryReadOnlyInWorker(sessionScope, assertRun, async (read, owner) => {
		if (!read.ok) throw read.error;
		const entry = read.value;
		if (owner.kind === "file" && typeof owner.source?.databaseIdentity === "string") {
			retained = retainPreparedSessionEntryPredicate({
				databaseIdentity: `file:${owner.source.databaseIdentity}`,
				sessionKey: owner.scope?.sessionKey ?? sessionKey,
				entry,
				matches: (before, after) => before?.sessionId === after?.sessionId && before?.lifecycleRevision === after?.lifecycleRevision && before?.execHost === after?.execHost && before?.execNode === after?.execNode && before?.execCwd === after?.execCwd
			});
			unregisterSource = registerOpenClawAgentDatabaseAsyncResource({
				agentId: owner.source.agentId,
				path: owner.source.path,
				revoke: () => {
					releaseSource();
				},
				close: releaseSource
			});
		}
		return entry;
	});
	const session = await readSession().catch(async (error) => {
		await releaseSource();
		throw error;
	});
	const placements = gateway.workerSessionPlacementService;
	const readPlacement = () => placements?.getMany([run.sessionId]).get(run.sessionId);
	const placement = await readSessionWorkerPlacementAsync({
		context: gateway,
		sessionId: run.sessionId
	}).catch(async (error) => {
		await releaseSource();
		throw error;
	});
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
		return releaseSource();
	};
	const assertCallerCurrent = Object.assign(() => {
		if (caller?.receiptAuthority?.() === false) throw new Error("Paired-node skill assignment or run authority changed. Retry from a fresh turn.");
	}, caller?.receiptAuthority);
	const assertCurrent = composeSessionSourceAssertion([assertRun, assertCallerCurrent], (assertSources) => {
		assertSources();
		combinedSignal.throwIfAborted();
		const current = memory ? memory.readCurrent() : session;
		const currentPlacement = readPlacement();
		if (closed || !sourceActive || !memory && !retained?.isCurrent() || gateway.nodeRegistry.get(node.nodeId) !== node || node.connId !== connectionId || node.pairingGeneration !== pairingGeneration || node.client.socket.readyState !== 1 || !node.caps.includes("claude-cli-skills-v1") || !isNodeCommandAllowed({
			command: "agent.cli.claude.run.v1",
			declaredCommands: node.commands,
			allowlist: resolveNodeCommandAllowlist(gateway.getRuntimeConfig(), {
				...node,
				approvedCommands: node.commands
			})
		}).ok || !session || session.sessionId !== run.sessionId || (run.expectedLifecycleRevision ?? run.sessionEntry?.lifecycleRevision) !== void 0 && session.lifecycleRevision !== (run.expectedLifecycleRevision ?? run.sessionEntry?.lifecycleRevision) || current?.sessionId !== session.sessionId || current?.lifecycleRevision !== session.lifecycleRevision || current.execHost !== "node" || current.execNode?.trim() !== node.nodeId || (current.execCwd?.trim() || void 0) !== (target.kind === "node" ? target.placement.cwd : void 0) || currentPlacement?.generation !== placement?.generation || currentPlacement?.environmentId !== placement?.environmentId || currentPlacement?.activeOwnerEpoch !== placement?.activeOwnerEpoch || placement && (!claim || !stopClaim || claim.runId !== run.runId || !currentPlacement || !isCurrentPlacementTurnClaim(currentPlacement, claim))) throw new Error("Paired-node skill assignment or run authority changed. Retry from a fresh turn.");
	});
	try {
		assertCurrent();
		const skillsSnapshot = run.skillsSnapshot;
		const resources = skillsSnapshot?.librarySelections?.length ? await runWithSessionSourceScope(assertCurrent, () => prepareSkillResourceDelivery(skillsSnapshot, assertCurrent, [], context.workspaceDir), { checkAfter: false }) : void 0;
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
		await close();
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
	const assertCurrent = composeSessionSourceAssertion([runtime.assertCurrent], (assertSource) => {
		assertSource();
		signal.throwIfAborted();
		if (!open || !invokeId || !registry.isInvokeCurrent(invokeId, runtime.node.nodeId, runtime.node.connId)) throw new Error("Paired-node Workshop invocation is no longer active.");
	});
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
			runWithSessionSourceScope(assertCurrent, async () => {
				assertCurrent();
				await endpoint.send(encodeNodeClaudeSkillMessage(runtime.init, NODE_CLAUDE_SKILLS_MESSAGE_BYTES));
			}, { checkAfter: false }).catch((error) => controller.abort(error));
		},
		onError: (error) => controller.abort(error)
	});
	const receive = async (bytes) => {
		assertCurrent();
		if (bytes.byteLength > 67108864) throw new Error("Paired-node Workshop request exceeds its limit.");
		const message = JSON.parse(Buffer.from(bytes).toString("utf8"));
		if (!Value.Check(NodeClaudeSkillUpstreamSchema, message)) throw new Error("Invalid paired-node skill message.");
		if (message.type === "stdout") {
			await runWithSessionSourceScope(assertCurrent, async () => {
				assertCurrent();
				params.onProgress(message.text);
			}, { checkAfter: false });
			return;
		}
		if (!runtime.workshop || !identity || calls.has(message.id) || calls.size >= 64) throw new Error("Paired-node Workshop callback is unavailable or already consumed. Send a fresh message.");
		calls.add(message.id);
		const result = await withGatewayToolCallerIdentity(identity, () => handlers.callTool({
			name: "skill_workshop",
			arguments: message.arguments
		}, signal));
		await runWithSessionSourceScope(assertCurrent, async () => {
			assertCurrent();
			await endpoint.send(encodeNodeClaudeSkillMessage({
				type: "result",
				id: message.id,
				result
			}, NODE_CLAUDE_WORKSHOP_RESULT_BYTES));
		}, { checkAfter: false });
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
			isDispatchAuthorized: Object.assign(() => {
				runtime.assertCurrent();
				return !signal.aborted && params.invocation.isDispatchAuthorized?.() !== false;
			}, runtime.assertCurrent),
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
	const assertReadable = params.assertReadable;
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
		authorizeDispatch: assertReadable ? async () => {
			await assertReadable();
			params.assertCurrent?.();
			return true;
		} : void 0,
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
	const outstandingWork = params.cliTimeout.activeToolCount + params.cliTimeout.backgroundTaskCount > 0 || params.cliTimeout.compactionActive === true;
	const graceMs = params.outstandingWorkGraceMs;
	const deferMs = outstandingWork && graceMs !== void 0 ? Math.max(params.timeoutMs, graceMs) - params.quietDurationMs : void 0;
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
					backgroundTaskCount: params.backgroundTaskCount(),
					compactionActive: params.compactionActive()
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
	captureSessionEventTarget: captureSessionEventTargetForHost,
	enqueueSessionEvent: enqueueSessionEventForHost,
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
	const emitLiveEvent = (stream, data) => {
		if (emitLiveEvents) emitAgentEvent({
			runId: runParams.runId,
			stream,
			data: data()
		});
	};
	let observedCliActivity = false;
	let compactionActive = false;
	const compactionChangeListeners = /* @__PURE__ */ new Set();
	const signaledPhases = /* @__PURE__ */ new Set();
	const signalExecutionPhase = (phase) => {
		if (signaledPhases.has(phase)) return;
		signaledPhases.add(phase);
		runParams.onExecutionPhase?.({
			phase,
			provider: runParams.provider,
			model: context.modelId,
			backend: context.backendResolved.id
		});
	};
	let commentaryCounter = 0;
	const toolSummaryById = /* @__PURE__ */ new Map();
	const toolArgsByCallId = /* @__PURE__ */ new Map();
	const emitToolEvent = (data, execution) => {
		let item = projectAgentToolActivity({
			...data,
			name: stripOpenClawMcpToolPrefix(data.name),
			args: execution ? execution.args : data.args
		});
		if (execution?.args === void 0 && execution?.requestedArgs !== void 0) item = projectAgentActivityItem(item, { args: execution.requestedArgs });
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
	const toolSummaryNames = /* @__PURE__ */ new Set();
	const activeParsedTools = /* @__PURE__ */ new Map();
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
		if (event.name) toolSummaryNames.add(event.name);
		return current;
	};
	const getToolSummary = () => ({
		calls: toolSummaryById.size,
		tools: [...toolSummaryNames],
		failures: Array.from(toolSummaryById.values()).filter((entry) => entry.failed).length
	});
	const emitToolUseStart = (event, tracked) => {
		observedCliActivity = true;
		toolArgsByCallId.set(event.toolCallId, {
			args: event.args,
			kind: event.kind,
			tracked,
			startedAt: Date.now()
		});
		recordToolSummary(event, false);
		signalExecutionPhase("tool_execution_started");
		if (tracked) params.toolTracking.handleCliToolUseStart(event);
		if (emitLiveEvents) emitToolEvent({
			phase: "start",
			name: event.name,
			toolCallId: event.toolCallId,
			args: event.args
		});
	};
	const emitToolResult = (event, tracked) => {
		observedCliActivity = true;
		const readResult = prepareToolResult(event.result);
		const summary = recordToolSummary(event, event.isError);
		const firstTerminal = !summary.terminalObserved;
		summary.terminalObserved = true;
		const loopbackOutcome = tracked ? params.toolTracking.resolveCliLoopbackTerminalOutcome(event.toolCallId) : void 0;
		const executedArgs = tracked ? params.toolTracking.handleCliToolResult(event) : void 0;
		const startedCall = toolArgsByCallId.get(event.toolCallId);
		toolArgsByCallId.delete(event.toolCallId);
		if (event.name.trim() && firstTerminal && !runParams.isolatedCompletion && !loopbackOutcome && stripOpenClawMcpToolPrefix(event.name) === event.name) {
			const result = readResult();
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
				result: readResult(),
				...tracked && startedArgs ? { args: startedArgs } : {},
				...resultContentSource ? { resultContentSource } : {}
			}, {
				args: executedArgs ?? (startedCall?.kind === "tool_use" && !event.name.startsWith("mcp_") ? startedArgs : void 0),
				requestedArgs: startedArgs
			});
		}
	};
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
		emitToolUseStart(event, true);
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
		emitToolResult(event, true);
	};
	const emitCliCompaction = (event) => {
		observedCliActivity = true;
		const previous = compactionActive;
		compactionActive = event.phase === "start";
		if (compactionActive !== previous) for (const listener of compactionChangeListeners) listener();
		emitLiveEvent("compaction", () => ({
			...event,
			backend: context.backendResolved.id
		}));
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
		emitLiveEvent("item", () => ({
			kind: "preamble",
			itemId: `commentary-${runParams.runId}-${commentaryCounter}`,
			phase: "end",
			title: "commentary",
			status: "running",
			progressText: applyPluginTextReplacements(text, context.backendResolved.textTransforms?.output)
		}));
	};
	const emitCliAssistantDelta = ({ text, delta }) => {
		if (text || delta) {
			observedCliActivity = true;
			signalExecutionPhase("assistant_output_started");
		}
		emitLiveEvent("assistant", () => ({
			itemId: cliAssistantItemId(runParams.runId),
			text: applyPluginTextReplacements(text, context.backendResolved.textTransforms?.output),
			delta: applyPluginTextReplacements(delta, context.backendResolved.textTransforms?.output)
		}));
	};
	const emitCliCompletedReply = (text, assistantMessageIndex) => {
		if (text) observedCliActivity = true;
		emitLiveEvent("assistant", () => ({
			assistantMessageIndex,
			completedText: applyPluginTextReplacements(text, context.backendResolved.textTransforms?.output)
		}));
	};
	const emitCliThinkingDelta = ({ text, delta, isReasoningSnapshot }) => {
		if (text || delta) observedCliActivity = true;
		emitLiveEvent("thinking", () => ({
			text,
			delta,
			...isReasoningSnapshot ? { isReasoningSnapshot } : {}
		}));
	};
	const emitCliThinkingProgress = ({ progressTokens }) => {
		observedCliActivity = true;
		emitLiveEvent("thinking", () => ({ progressTokens }));
	};
	const emitCliToolInputDelta = (progress) => {
		observedCliActivity = true;
		emitLiveEvent("tool", () => ({
			phase: "input_delta",
			...progress
		}));
	};
	return {
		emitLiveEvents,
		emitCliToolInputDelta,
		emitCliDisplayToolUseStart: (event) => emitToolUseStart(event, false),
		emitCliDisplayToolResult: (event) => emitToolResult(event, false),
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
		hasActiveCompaction: () => compactionActive,
		onCompactionActiveChange: (listener) => registerListener(compactionChangeListeners, listener),
		activeParsedToolCount: () => activeParsedTools.size,
		isActiveForegroundAgentTool: (toolCallId) => {
			const tool = activeParsedTools.get(toolCallId);
			return tool !== void 0 && isClaudeForegroundAgentToolName(tool.toolName);
		},
		getToolSummary
	};
}
//#endregion
//#region src/agents/cli-runner/execute-logging.ts
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
		return new Set(filterStringEntries(JSON.parse(trimmed)));
	} catch {
		return /* @__PURE__ */ new Set();
	}
	return new Set(trimmed.split(/[,\s]+/).filter(Boolean));
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
function buildCliExecLogLine(params) {
	const resumeSessionId = params.useResume ? params.resolvedSessionId?.trim() : void 0;
	return [
		`cli exec: provider=${params.provider}`,
		`model=${params.model}`,
		`promptChars=${params.promptChars}`,
		`trigger=${params.trigger ?? "unknown"}`,
		`useResume=${params.useResume ? "true" : "false"}`,
		`session=${params.cliSessionId ? "present" : "none"}`,
		`resumeSession=${resumeSessionId ? sha256Hex(resumeSessionId).slice(0, 12) : "none"}`,
		`reuse=${formatCliSessionReuseLogState(params.reusableSession)}`,
		`historyPrompt=${params.hasHistoryPrompt ? "present" : "none"}`
	].join(" ");
}
function logCliInvocation(params) {
	const logArgs = [];
	for (let i = 0; i < params.args.length; i += 1) {
		const arg = params.args[i] ?? "";
		logArgs.push(arg);
		if (arg === params.systemPromptArg || arg === params.modelArg || arg === params.imageArg) {
			const value = params.args[i + 1] ?? "";
			logArgs.push(arg === params.systemPromptArg ? `<systemPrompt:${value.length} chars>` : arg === params.modelArg ? value : "<image>");
			i += 1;
		}
	}
	if (params.argsPrompt) {
		const promptIndex = logArgs.indexOf(params.argsPrompt);
		if (promptIndex >= 0) logArgs[promptIndex] = `<prompt:${params.argsPrompt.length} chars>`;
	}
	params.log(`cli argv: ${params.command} ${logArgs.join(" ")}`);
	const childEnv = params.env;
	const formatKeys = (keys, labels) => {
		const present = (env) => keys.filter((key) => typeof env[key] === "string" && env[key].length > 0);
		const host = present(process.env);
		const child = present(childEnv);
		return [
			host,
			child,
			host.filter((key) => !child.includes(key))
		].map((values, index) => `${labels[index]}=${values.join(",") || "none"}`).join(" ");
	};
	params.log(`cli env auth: ${formatKeys(CLI_ENV_AUTH_LOG_KEYS, [
		"host",
		"child",
		"cleared"
	])} ${formatKeys(CLI_ENV_RUNTIME_LOG_KEYS, [
		"runtimeHost",
		"runtimeChild",
		"runtimeCleared"
	])}`);
	if (params.env.OPENCLAW_MCP_TOKEN) params.log(`cli env mcp: token=set capture=${params.env.OPENCLAW_MCP_CLI_CAPTURE_KEY ? "set" : "missing"}`);
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
	const detachReplyBackend = attachCliReplyBackend(contextParams, abortNodeRun);
	const hardTimeoutResult = () => ({
		ok: false,
		error: {
			code: "TIMEOUT",
			message: "paired-node Claude CLI invocation exceeded its hard timeout"
		}
	});
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
				return hardTimeoutResult();
			}
			assertCurrent();
			return await runWithAgentToolSourceExecutionScope(assertCurrent, () => params.deps.invokeNodeClaudeCliRun({
				assertCurrent,
				assertReadable: params.context.cliHistoryWriter?.assertReadable,
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
			}));
		};
		nodeResult = await invokeNode();
		const approval = parseNodeClaudeApprovalRequired(nodeResult);
		if (approval) {
			skillRuntime?.assertCurrent();
			const approvalId = crypto.randomUUID();
			const registration = await racePromiseWithAbortSignal(() => params.deps.registerExecApprovalRequestForHostOrThrow({
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
			}), skillRuntime?.signal ?? nodeAbortController.signal, createCliAbortError);
			const decision = await racePromiseWithAbortSignal(() => params.deps.resolveRegisteredExecApprovalDecision({
				approvalId: registration.id,
				preResolvedDecision: registration.finalDecision
			}), skillRuntime?.signal ?? nodeAbortController.signal, createCliAbortError);
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
		nodeResult = hardTimeoutResult();
	} finally {
		if (skillRuntime?.signal.aborted) nodeAbortController.abort();
		await skillRuntime?.close();
		clearTimeout(hardDeadlineTimer);
		detachReplyBackend?.();
		contextParams.abortSignal?.removeEventListener("abort", abortNodeRun);
	}
	if (hardDeadlineReached) nodeResult = hardTimeoutResult();
	const errorCode = nodeResult.ok ? void 0 : nodeResult.error?.code;
	const failureDurationMs = nodeResult.ok ? void 0 : Date.now() - startedAt;
	const payload = nodeResult.ok ? parseNodeClaudeResultPayload(nodeResult) : {
		exitCode: 1,
		stderrTail: nodeResult.error?.message ?? "paired-node Claude CLI invocation failed",
		truncated: false,
		timeoutKind: errorCode === "IDLE_TIMEOUT" ? "idle" : errorCode === "TIMEOUT" ? "hard" : void 0
	};
	if (!nodeResult.ok || payload.stderrTail) params.consumeStderr(payload.stderrTail);
	return {
		result: {
			reason: payload.timeoutKind === "idle" ? "no-output-timeout" : payload.timeoutKind === "hard" ? "overall-timeout" : errorCode === "ABORTED" ? "manual-cancel" : "exit",
			exitCode: payload.timeoutKind || errorCode === "ABORTED" ? null : payload.exitCode,
			exitSignal: null,
			durationMs: failureDurationMs ?? Date.now() - startedAt,
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
			const policyContext = captureOpenClawStateWorkerContext();
			const file = (await readExecApprovalsSnapshotAsync(policyContext)).file;
			params.abortSignal?.throwIfAborted();
			params.assertActive?.();
			const { allowlist } = resolveExecApprovalsFromFileInternal({
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
			if (rendered.ok) autoAllow = async () => {
				const assertCurrent = () => {
					params.abortSignal?.throwIfAborted();
					params.assertActive?.();
				};
				assertCurrent();
				const authorization = {
					source: "current-policy",
					security: "allowlist",
					ask: params.ask,
					allowlistSatisfied: true
				};
				const assertPolicyCurrent = await recordAllowlistMatchesUse({
					assertCurrent,
					agentId: params.agentId,
					matches: analysis.allowlistMatches,
					command: bashCommand,
					resolvedPath: candidates[0]?.sourceSegment.resolution?.execution.resolvedPath ?? void 0,
					authorization
				}, policyContext);
				assertCurrent();
				assertPolicyCurrent();
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
		if (autoAllow) return await autoAllow();
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
//#region src/agents/cli-runner/execute-plugin.steered-transcript.ts
/** One host adapter owns final input admission and accepted transcript custody. */
function createSteeredCliMessageInjection(params) {
	const queueMessage = async (text, options, assertInjectionCurrent, prepareCurrent) => {
		const injection = params.getInjection();
		if (!injection) throw new Error("CLI plugin runtime does not accept input during its turn.");
		return await queueSteeredCliUserTurn(() => injection.queueMessage(text, async (submit) => {
			let submitted = false;
			try {
				await runWithAgentToolSourceExecutionScope(params.assertCurrent, async () => {
					await withMessageInjectionAdmission(prepareCurrent, () => {
						assertInjectionCurrent();
						params.assertCurrent();
						submit();
						submitted = true;
					});
				});
			} catch (cause) {
				if (submitted) throw new MessageInjectionAcceptedUnconfirmedError({ cause });
				throw cause;
			}
		}), options, params.cwd);
	};
	return {
		version: 2,
		isAvailable: () => !params.signal.aborted && params.getInjection()?.isAvailable() === true,
		queueMessage: (text, options, assertInjectionCurrent) => queueMessage(text, options, assertInjectionCurrent),
		queueMessageAsync: (text, options, preparation) => queueMessage(text, options, preparation.assertCurrent, preparation.prepareCurrent)
	};
}
/** Native acceptance owns replay safety; transcript settlement releases input custody. */
async function queueSteeredCliUserTurn(inject, options, cwd) {
	let accepted = false;
	let failure;
	let result;
	try {
		await inject();
		accepted = true;
		options?.onQueueAccepted?.(true);
		const recorder = options?.userTurnTranscriptRecorder;
		if (recorder && !recorder.hasPersisted() && !recorder.isBlocked()) {
			if (!await recorder.persistApproved({ cwd }) && !recorder.hasPersisted() && await recorder.resolveMessage()) {
				recorder.markBlocked();
				result = {
					transcriptCommit: "unconfirmed",
					errorMessage: "steered CLI user turn transcript commitment could not be confirmed"
				};
			}
		}
	} catch (error) {
		failure = toErrorObject(error, "CLI steering failed.");
	}
	try {
		options?.onQueueSettled?.();
	} catch (error) {
		failure ??= toErrorObject(error, "CLI steering completion observer failed.");
	}
	if (failure) {
		if (!accepted) throw failure;
		const errorMessage = `steered CLI user turn was not settled: ${formatErrorMessage(failure)}`;
		cliBackendLog.warn(errorMessage);
		return {
			transcriptCommit: "unconfirmed",
			errorMessage
		};
	}
	return result;
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
async function createPluginToolPermissionHandler(params) {
	const run = params.context.params;
	const permission = await resolveExecDefaultsAsync({
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
		if (params.context.hostOwnedTools?.includes(canonicalToolName)) return denyTool(`Use OpenClaw ${canonicalToolName}; its native equivalent is unavailable.`);
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
	return racePromiseWithAbortSignal(() => iterator.next().catch((error) => {
		throw toErrorObject(error, "CLI plugin execution stream failed.");
	}), signal, () => toErrorObject(signal.reason, "CLI plugin execution was aborted."));
}
async function closePluginIterator(iterator) {
	if (!iterator?.return) return;
	try {
		await raceWithTimeout(iterator.return(), PLUGIN_ITERATOR_CLOSE_TIMEOUT_MS, () => {
			throw new Error("CLI plugin runtime did not close after its run ended.");
		}, { ref: false });
	} catch (error) {
		recordAgentCleanupFailure();
		throw error;
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
	const reportOutstandingWork = () => {
		const toolWork = outstanding.approvals > 0 || outstanding.background > 0;
		params.onOutstandingWorkChange?.(toolWork || (params.compactionActive?.() ?? false));
	};
	const updatePendingApproval = (delta) => {
		outstanding.approvals = Math.max(0, outstanding.approvals + delta);
		reportOutstandingWork();
	};
	let watchdog;
	let stopAskUserDeadlineListener;
	let stopCompactionWorkListener;
	let messageInjection;
	const detachReplyBackend = attachCliReplyBackend(run, () => {
		termination.reason = "manual-cancel";
		controller.abort(createCliAbortError());
	}, { messageInjectionV2: createSteeredCliMessageInjection({
		getInjection: () => messageInjection,
		signal,
		assertCurrent,
		cwd: run.cwd ?? run.workspaceDir
	}) });
	let iterator;
	let liveSession;
	let terminalResult = "none";
	try {
		const requestToolPermission = await racePromiseWithAbortSignal(() => createPluginToolPermissionHandler({
			context: params.context,
			abortSignal: signal,
			onPendingApproval: updatePendingApproval,
			env: params.env
		}), signal, createCliAbortError);
		assertCurrent();
		watchdog = createCliPluginWatchdog({
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
			compactionActive: () => params.compactionActive?.() ?? false,
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
		stopAskUserDeadlineListener = params.onActiveLoopbackAskUserDeadlineChange?.(() => watchdog?.reset());
		stopCompactionWorkListener = params.onCompactionActiveChange?.(() => reportOutstandingWork());
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
		await params.context.cliHistoryWriter?.assertReadable();
		assertCurrent();
		const started = await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
			assertCurrent();
			const executionIterator = params.execute({
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
				...detachReplyBackend ? { registerMessageInjection: (injection) => {
					messageInjection = injection;
				} } : {},
				requestToolPermission: AsyncLocalStorage.bind(requestToolPermission),
				requestUserInput: createPluginUserInputHandler({
					context: params.context,
					abortSignal: signal,
					onPendingInput: updatePendingApproval
				})
			})[Symbol.asyncIterator]();
			iterator = executionIterator;
			return {
				iterator: executionIterator,
				next: await waitForIteratorValue(executionIterator, signal)
			};
		});
		let next = started.next;
		for (;;) {
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
			next = await waitForIteratorValue(started.iterator, signal);
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
		watchdog?.dispose();
		stopAskUserDeadlineListener?.();
		stopCompactionWorkListener?.();
		params.onOutstandingWorkChange?.(false);
		if (!controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("CLI plugin runtime turn is no longer active."));
		detachReplyBackend?.();
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
//#region src/agents/cli-runner/reliability.ts
function resolveCliNoOutputTimeoutMs(params) {
	if (params.expectedQuiet) return params.timeoutMs;
	const hasExplicitRunTimeout = typeof params.runTimeoutOverrideMs === "number" && Number.isFinite(params.runTimeoutOverrideMs) && params.runTimeoutOverrideMs > 0;
	const configured = params.useResume ? params.backend.reliability?.watchdog?.resume : params.backend.reliability?.watchdog?.fresh;
	const defaults = params.useResume && !configured && (params.trigger === "cron" || hasExplicitRunTimeout) ? CLI_FRESH_WATCHDOG_DEFAULTS : params.useResume ? CLI_RESUME_WATCHDOG_DEFAULTS : CLI_FRESH_WATCHDOG_DEFAULTS;
	const ratio = asFiniteNumber(configured?.noOutputTimeoutRatio);
	const noOutputTimeoutRatio = ratio === void 0 ? defaults.noOutputTimeoutRatio : Math.max(.05, Math.min(.95, ratio));
	const minMs = resolveOptionalIntegerOption(configured?.minMs, { min: 1e3 }) ?? defaults.minMs;
	const maxMs = resolveOptionalIntegerOption(configured?.maxMs, { min: 1e3 }) ?? defaults.maxMs;
	const cap = Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, params.timeoutMs - 1e3);
	const computed = Math.floor(params.timeoutMs * noOutputTimeoutRatio);
	return Math.min(Math.min(Math.max(minMs, maxMs), Math.max(Math.min(minMs, maxMs), computed)), cap);
}
function resolveCliRunTimeoutOverrideMs(params) {
	if (params.runTimeoutOverrideMs !== void 0) return params.runTimeoutOverrideMs;
	const configuredTimeoutSeconds = params.config?.agents?.defaults?.timeoutSeconds;
	return params.lane !== AGENT_LANE_SUBAGENT && typeof configuredTimeoutSeconds === "number" && Number.isFinite(configuredTimeoutSeconds) && configuredTimeoutSeconds > 0 ? params.timeoutMs : void 0;
}
function buildCliSupervisorScopeKey(params) {
	const commandToken = normalizeLowercaseStringOrEmpty(path.basename(params.backend.command ?? ""));
	const backendToken = normalizeLowercaseStringOrEmpty(params.backendId);
	const sessionToken = params.cliSessionId?.trim();
	if (!sessionToken) return;
	return `cli:${backendToken}:${commandToken}:${sessionToken}`;
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
	const resumeCheckpointId = params.useResume ? runParams.cliSessionResumeAt : void 0;
	const hasJsonlOutput = params.outputMode === "jsonl";
	const eventDelivery = runParams.sourceReplyDeliveryMode === "message_tool_only" || getAgentRunContext(runParams.runId)?.sessionEventDelivery === false ? false : void 0;
	const eventSessionKey = runParams.sessionKey ? resolveEventSessionKeyForPolicy(runParams.sessionKey, resolveEventSessionRoutingPolicy({
		cfg: runParams.config,
		sessionKey: runParams.sessionKey,
		channel: runParams.messageProvider,
		accountId: runParams.agentAccountId
	})) : void 0;
	const eventAgentId = eventSessionKey ? resolveSessionAgentId({
		config: runParams.config ?? {},
		sessionKey: eventSessionKey,
		agentId: runParams.agentId
	}) : void 0;
	let eventTarget;
	if (eventSessionKey && eventAgentId && params.events.emitLiveEvents) {
		try {
			eventTarget = await params.deps.captureSessionEventTarget(eventAgentId, eventSessionKey, {
				producerPolicy: context.sessionEventSourcePolicy,
				assertCaptureCurrent: params.assertCurrent
			});
		} catch (error) {
			cliBackendLog.warn(`CLI watchdog follow-up unavailable: ${formatErrorMessage(error)}`);
		}
		params.assertCurrent();
	}
	const streamingParser = hasJsonlOutput ? createCliJsonlStreamingParser({
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
		onToolInputDelta: params.events.emitCliToolInputDelta,
		onToolResult: params.events.emitParsedToolResult,
		onDisplayToolUseStart: params.events.emitCliDisplayToolUseStart,
		onDisplayToolResult: params.events.emitCliDisplayToolResult,
		onCommentaryText: params.events.emitLiveEvents && runParams.emitCommentaryText ? params.events.emitCliCommentaryText : void 0,
		onSessionId: params.observeForkSuccessor,
		onNativeTools: context.preparedBackend.mcpClientGrantCapture?.captureNativeTools,
		onAssistantMessage: params.diagnostics?.observeAssistantMessage,
		onUsage: params.diagnostics?.observeUsage,
		onAttributedSubagentProgress: (parentToolUseId) => {
			if (!params.events.isActiveForegroundAgentTool(parentToolUseId)) return;
			backendActivity?.observeAttributedAgentProgress(parentToolUseId);
		}
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
	let stopForParserRefusal;
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
		if (streamingParser?.getErrorText()) stopForParserRefusal?.();
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
			consumeStdout: (chunk) => {
				consumeStdout(chunk);
				const errorText = streamingParser?.getErrorText();
				if (errorText) throw createCliFailoverError(errorText, "format", failoverContext);
			},
			onOutstandingWorkChange: backendActivity?.setOutstandingWork,
			activeToolCount: params.events.activeParsedToolCount,
			compactionActive: params.events.hasActiveCompaction,
			onCompactionActiveChange: params.events.onCompactionActiveChange,
			getActiveLoopbackAskUserDeadline: params.toolTracking.getActiveLoopbackAskUserDeadline,
			onActiveLoopbackAskUserDeadlineChange: params.toolTracking.onActiveLoopbackAskUserDeadlineChange,
			onNoOutputTimeout: (error) => {
				pluginTimeout.error = error;
			},
			onInterrupted: (reason) => {
				streamingParser?.finish();
				const partialOutput = streamingParser?.getOutput();
				if (partialOutput?.partialOutputRejected && partialOutput.errorText) throw createCliFailoverError(partialOutput.errorText, "format", failoverContext, { code: CLI_PARTIAL_OUTPUT_REJECTED_ERROR_CODE });
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
			throw resolveCliResumeAtError(error, { resumeAtArg }, failoverContext) ?? error;
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
				const managedRun = await runWithAgentToolSourceExecutionScope(params.assertCurrent, () => withChildProcessOperation("agent.cli", () => supervisor.spawn({
					assertCurrent: params.assertCurrent,
					prepareSpawn: params.argsPrompt ? context.cliHistoryWriter?.assertReadable : void 0,
					prepareInput: params.stdin ? context.cliHistoryWriter?.assertReadable : void 0,
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
				})));
				managedRunPid = managedRun.pid;
				stopForParserRefusal = () => {
					processCancelled = true;
					managedRun.cancel("manual-cancel");
				};
				if (streamingParser?.getErrorText()) stopForParserRefusal();
				const detachReplyBackend = attachCliReplyBackend(runParams, stopForParserRefusal);
				try {
					result = await managedRun.wait();
					processCancelled ||= result.reason !== "exit";
				} finally {
					detachReplyBackend?.();
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
	const streamingParserErrorText = streamingParser?.getErrorText();
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
	for (const level of ["info", "debug"]) if (level === "info" ? params.logOutputText : shouldLogVerbose()) {
		for (const [stream, diagnostic] of [["stdout", stdoutDiagnostic], ["stderr", stderrDiagnostic]]) if (diagnostic) cliBackendLog[level](`cli ${stream}:\n${diagnostic}`);
	}
	const streamedJsonlOutput = streamingParser?.getOutput();
	const parseOutput = () => parseCliOutput({
		raw: readStdout(),
		backend: params.backend,
		providerId: context.backendResolved.id,
		outputMode: params.outputMode,
		fallbackSessionId: params.resolvedSessionId
	});
	const parsedStructuredOutput = streamedJsonlOutput ?? (params.outputMode === "json" && stdoutCapture.truncatedBytes === 0 ? parseOutput() : null);
	if (parsedStructuredOutput?.terminalFailure) {
		const checkpointError = parsedStructuredOutput.errorText ? resolveCliResumeAtError(parsedStructuredOutput.errorText, { resumeCheckpointId }, failoverContext) : void 0;
		if (checkpointError) throw checkpointError;
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
					backgroundTaskCount: 0,
					compactionActive: params.events.hasActiveCompaction()
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
				if (eventSessionKey && eventAgentId && eventTarget) try {
					params.deps.enqueueSessionEvent(stallNotice, {
						agentId: eventAgentId,
						sessionKey: eventSessionKey,
						source: "exec",
						expectedTarget: eventTarget,
						deliver: eventDelivery
					}).settled.then((outcome) => {
						if (outcome.status === "failed") cliBackendLog.warn(`CLI watchdog follow-up failed: ${outcome.error}`);
					});
				} catch (error) {
					cliBackendLog.warn(`CLI watchdog follow-up rejected: ${formatErrorMessage(error)}`);
				}
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
			resumeAtArg: retryEmptyFailure ? resumeAtArg : void 0,
			resumeCheckpointId
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
	const parsed = parsedStructuredOutput ?? parseOutput();
	const checkpointError = parsed.errorText ? resolveCliResumeAtError(parsed.errorText, { resumeCheckpointId }, failoverContext) : void 0;
	if (checkpointError) throw checkpointError;
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
	const listeners = /* @__PURE__ */ new Set();
	let selected;
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
		if (nextDeadline === selected) return;
		selected = nextDeadline;
		listeners.forEach((listener) => listener());
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
	return {
		clear,
		update,
		refresh,
		get: () => selected,
		onChange: (listener) => registerListener(listeners, listener)
	};
}
function extractCliMessagingTarget(context, toolName, args) {
	const normalizedToolName = stripOpenClawMcpToolPrefix(toolName);
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
	return sha256Hex(JSON.stringify([
		send.tool,
		send.provider,
		send.accountId,
		send.to,
		send.threadId,
		send.threadImplicit,
		send.threadSuppressed,
		send.text,
		send.mediaUrls
	]));
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
function appendUniqueCliMessagingEvidence(values, additions) {
	for (const addition of additions) {
		if (!addition || values.has(addition)) continue;
		if (values.size >= 64) for (const oldest of values) {
			values.delete(oldest);
			break;
		}
		values.add(addition);
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
	const messagingToolSentTexts = /* @__PURE__ */ new Set();
	const messagingToolSentMediaUrls = /* @__PURE__ */ new Set();
	const messagingToolSentTargets = /* @__PURE__ */ new Map();
	const messagingToolSourceReplyPayloads = [];
	const toolMediaUrls = /* @__PURE__ */ new Set();
	let toolAudioAsVoice = false;
	let toolTrustedLocalMedia = false;
	const acceptedSessionSpawns = [];
	const matchesCliLoopbackCall = (toolName, toolArgs, call) => stripOpenClawMcpToolPrefix(toolName) === call.toolName && isDeepStrictEqual(toolArgs, call.args);
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
		if (!(deliveryFact ? deliveryFact.status === "settled" && (!params.isError || deliveryFact.partialDelivery) : isDeliveredMessagingToolResult(params))) return;
		didSendViaMessagingTool = true;
		if (deliveryFact?.sourceReplyDelivered === true) sourceReplyDelivered = true;
		const toolArgs = params.args;
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
		if (!deliveredCurrentSourceReply && isMessagingSend && resolveMessageToolSourceReplyFinal(toolArgs) && context.params.inputProvenance?.kind !== "inter_session" && extractMessagingToolSourceReplyPayload(params.result)) sourceReplyDelivered = true;
		if (isMessagingSend) {
			appendUniqueCliMessagingEvidence(messagingToolSentTexts, content.text ? [content.text] : []);
			appendUniqueCliMessagingEvidence(messagingToolSentMediaUrls, content.mediaUrls ?? []);
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
		if (messagingToolSentTargets.has(evidenceKey)) return;
		if (messagingToolSentTargets.size >= 64) for (const oldest of messagingToolSentTargets.keys()) {
			messagingToolSentTargets.delete(oldest);
			break;
		}
		messagingToolSentTargets.set(evidenceKey, targetWithContent);
	};
	const isPreparedInternalSourceReply = async (call) => {
		if (context.params.sourceReplyDeliveryMode !== "message_tool_only" || stripOpenClawMcpToolPrefix(call.toolName) !== "message" || call.args.action !== "send" || !context.params.config) return false;
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
		const isPotentialDelivery = (toolName) => isMessagingTool(stripOpenClawMcpToolPrefix(toolName));
		const isPreparedDelivery = (toolName, toolArgs) => toolArgs.dryRun !== true && isMessagingToolDeliveryAction(stripOpenClawMcpToolPrefix(toolName), toolArgs);
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
					const toolName = stripOpenClawMcpToolPrefix(current.toolName);
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
				const toolName = stripOpenClawMcpToolPrefix(call.toolName);
				const acceptedSessionSpawn = toolName === "sessions_spawn" && call.outcome === "completed" ? normalizeAcceptedSessionSpawnResult(call.result) : null;
				if (acceptedSessionSpawn && acceptedSessionSpawns.length < CLI_LOOPBACK_CORRELATION_MAX_CALLS) acceptedSessionSpawns.push(acceptedSessionSpawn);
				if (isMessagingToolDeliveryAction(toolName, call.args)) commitMessagingToolResult({
					toolName,
					target: extractCliMessagingTarget(context, toolName, call.args),
					args: call.args,
					result: "result" in call ? call.result : void 0,
					isError: call.outcome !== "completed"
				});
				else if (call.outcome === "completed") {
					const artifact = extractToolResultMediaArtifact(call.result);
					const mediaUrls = artifact ? filterToolResultMediaUrls(toolName, artifact.mediaUrls, call.result) : [];
					appendUniqueCliMessagingEvidence(toolMediaUrls, mediaUrls);
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
				toolName: stripOpenClawMcpToolPrefix(event.name),
				args: event.args
			};
			const pendingCandidates = cliLoopbackCalls.filter((candidate) => candidate.boundToolCallId === void 0 && matchesCliLoopbackCall(event.name, event.args, candidate.admitted));
			const hasAssociatedPeer = matchingActiveCliTools(admittedCall).some(([toolCallId, peer]) => toolCallId !== event.toolCallId && (peer.loopbackCall !== void 0 || peer.loopbackAmbiguous));
			const pending = pendingCandidates[0];
			if (hasAssociatedPeer || pendingCandidates.length > 1 || pending?.ambiguous) markCliLoopbackSignatureAmbiguous(admittedCall);
			if (pending) bindCliLoopbackCall(pending, event.toolCallId, activeTool);
		}
		const toolName = stripOpenClawMcpToolPrefix(event.name);
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
				...pending,
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
		messagingToolSentTexts: [...messagingToolSentTexts],
		messagingToolSentMediaUrls: [...messagingToolSentMediaUrls],
		messagingToolSentTargets: [...messagingToolSentTargets.values()],
		messagingToolSourceReplyPayloads,
		toolMediaUrls: [...toolMediaUrls],
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
	return Array.isArray(message.content) && message.content.slice(0, MAX_CAPTURED_OUTPUT_BLOCKS).some(isTextAssistantContentBlock);
}
function normalizeClaudeAssistantMessage(message, budget) {
	if (!isRecord(message)) return;
	if (message.content === "") return;
	const content = [];
	const sourceBlocks = typeof message.content === "string" ? [{
		type: "text",
		text: message.content
	}] : Array.isArray(message.content) ? message.content.slice(0, MAX_CAPTURED_OUTPUT_BLOCKS) : [];
	if (Array.isArray(message.content) && sourceBlocks.length < message.content.length) budget.truncated = true;
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
	if (content.length === 0) return;
	const stopReason = typeof message.stop_reason === "string" ? captureTextWithinBudget(message.stop_reason, budget) : void 0;
	return {
		role: "assistant",
		content,
		...stopReason !== void 0 ? { stopReason } : {}
	};
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
		...params.context.params.agentId ? { agentId: params.context.params.agentId } : {},
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
		if (!messages.some(assistantMessageHasText) && responseText && messages.length < MAX_CAPTURED_OUTPUT_MESSAGES) {
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
			const failureKind = isFailoverError(error) && error.reason === "timeout" ? "timeout" : diagnosticErrorFailureKind(error) ?? (params.context.params.abortSignal?.aborted ? "aborted" : void 0);
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
function exactToolAvailabilityError(params) {
	if (!params.isolatedCompletion) return new Error(params.message);
	return Object.assign(new Error(params.message), {
		name: "IsolatedCompletionRuntimeError",
		code: params.code
	});
}
function assertExactToolAvailabilityRuntimeVersion(params) {
	const artifact = params.executableIdentity?.runtimeArtifact;
	const packageVersion = artifact?.kind === "package-tree" ? artifact.packageVersion : void 0;
	const parsedVersion = packageVersion ? parse$1(packageVersion) : null;
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
async function executePreparedCliRun(inputContext, cliSessionIdToUse, options) {
	const context = inputContext.cliHistoryWriter ? {
		...inputContext,
		params: {
			...inputContext.params,
			assertCurrent: inputContext.cliHistoryWriter.assertCurrent
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
	const attemptPrompt = cliSessionIdToUse ? params.prompt : context.openClawHistoryPrompt ?? params.prompt;
	const basePrompt = composeCliPromptContext(attemptPrompt, { prependContext: useResume && cliSessionIdToUse === resolveCliSessionId(context.reusableCliSession) && !params.forkCliSessionOnResume ? context.resumeContext : void 0 });
	let prompt = params.controlOperation !== void 0 ? basePrompt : applyPluginTextReplacements(basePrompt, context.backendResolved.textTransforms?.input);
	const promptContext = context.promptContext ? {
		...context.promptContext.prependContext ? { prependContext: applyPluginTextReplacements(context.promptContext.prependContext, context.backendResolved.textTransforms?.input) } : {},
		...context.promptContext.appendContext ? { appendContext: applyPluginTextReplacements(context.promptContext.appendContext, context.backendResolved.textTransforms?.input) } : {}
	} : void 0;
	if (nodePlacement && ((params.images?.length ?? 0) > 0 || (params.mediaImageLayout ? params.mediaImageLayout.slots.length > 0 : hasHydratableMediaImages(params.media)) || (params.imagePrompt ? detectImageReferences(params.imagePrompt).length > 0 : false))) throw new Error("paired-node Claude CLI sessions do not support attachments or images");
	const imageTurnEntryId = isClaudeCliBackendId(context.backendResolved.id) ? params.userTurnTranscriptRecorder?.getAdmissionReceipt()?.entryId : void 0;
	const imagePayload = nodePlacement ? {
		prompt,
		imagePaths: []
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
		agentId: params.agentId,
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
	const sentPrompt = composeCliPromptContext(prompt, promptContext);
	options?.onPromptPrepared?.(sentPrompt);
	const diagnostics = createClaudeCliModelCallDiagnostics({
		context,
		prompt: sentPrompt,
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
				trigger: params.isolatedCompletionPurpose ?? params.trigger,
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
			const nodeClearEnv = [.../* @__PURE__ */ new Set([...selectedClaudeClearEnv ?? [], ...nodeRuntimeClearEnv])];
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
					agentId: params.agentId,
					workspaceDir: context.workspaceDir,
					provider: params.provider,
					modelId: context.modelId,
					authProfileId: context.effectiveAuthProfileId,
					thinkingLevel: params.thinkLevel === "ultra" ? context.providerThinkingLevel : params.thinkLevel,
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
					hostOwnedTools: context.hostOwnedTools,
					useResume,
					...params.controlOperation === "compact" ? { controlOperation: "compact" } : {},
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
		completedOutput = await enqueueCommandInLane(`cli:${queueKey}`, () => {
			const runQueuedAttempt = async () => {
				assertCurrent();
				if (params.lifecycleGeneration) assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
				diagnostics?.emitStarted();
				if (params.controlOperation === "compact") await restartCliLiveSession(context);
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
		}, { abortSignal: params.abortSignal });
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
			await runCliCleanup(params, "cli-outer-resource", async () => {
				await systemPromptFile?.cleanup();
			});
		} catch (error) {
			if (completedOutput?.didSendViaMessagingTool) cliBackendLog.warn(`CLI outer resource cleanup failed after confirmed message delivery: ${formatErrorMessage(error)}`);
			else if (executionError !== void 0) cliBackendLog.warn(`CLI outer resource cleanup also failed after run error: ${formatErrorMessage(error)}`);
			else outerCleanupError = toErrorObject(error, "CLI outer resource cleanup failed");
		}
	}
	if (outerCleanupError) {
		options?.onPhase?.("cleanup");
		diagnostics?.emitError(outerCleanupError);
		throw outerCleanupError;
	}
	diagnostics?.emitCompleted(completedOutput);
	return completedOutput;
}
//#endregion
export { executePreparedCliRun as t };
