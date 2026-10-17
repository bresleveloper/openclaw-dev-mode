import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as isAbortError } from "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { O as freezeDiagnosticTraceContext, T as createDiagnosticTraceContext, k as getActiveDiagnosticTraceContext } from "./diagnostic-events-BADdmgZf.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { g as withSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { a as isCurrentPluginMetadataSnapshotRuntimeGeneration, i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-C9K4a_6k.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { g as resolveSessionAgentId, h as resolveRunModelFallbacksOverride, v as resolveSessionAgentIds } from "./agent-scope-CG17uXFn.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { d as toolPolicyRestrictsTools } from "./tool-policy-BKvvmcQR.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { n as withPluginRuntimeGenerationScope, t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { a as projectModelThinkingCompat } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { i as isOpenAIProvider } from "./openai-routing-92B-lj2w.mjs";
import { n as parseGitUrl } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { n as emitSessionTranscriptUpdate } from "./transcript-events-DUHAZLVw.mjs";
import { i as generateSecureToken } from "./secure-random-Dimnnrm0.mjs";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-By9R9pyt.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-D5rL9Ed5.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-Rdb47msF.mjs";
import { i as listRegisteredPluginAgentPromptGuidance } from "./command-registry-state-BssLGv4I.mjs";
import { d as prepareSystemAgentRunAdmission } from "./admitted-run-context-QJnFIxUZ.mjs";
import { T as MissingProviderAuthError } from "./model-auth-provider-config-s9IgFbYq.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore } from "./store-runtime-Qx0DZ2Si.mjs";
import { o as resolveCodexAgentHarnessNativeCompaction } from "./registry-BrXrewXj.mjs";
import { r as wrapStreamFnTextTransforms } from "./plugin-text-transforms-Dyv8bBue.mjs";
import { i as unwrapSecretSentinelsForProviderEgress } from "./provider-secret-egress-LltAZ95s.mjs";
import { r as getModelProviderRuntimePluginHandle, t as attachModelProviderRuntimePluginHandle } from "./provider-hook-runtime-v-FSBQP8.mjs";
import { A as resolveProviderTextTransforms, L as transformProviderSystemPrompt, _ as prepareProviderRuntimeAuth } from "./provider-runtime-Ck_Cecr1.mjs";
import { n as getModelRegistryRuntime } from "./model-registry-DKSOyLSb.mjs";
import { n as extractModelCompat } from "./provider-model-compat-DQ2tKK7m.mjs";
import { r as detectRuntimeShell } from "./shell-utils-CAfQmeJ0.mjs";
import { n as resolveModelCandidateChain } from "./model-fallback-candidates-COPIBIvt.mjs";
import { a as projectPreparedModelProvider } from "./availability-DXC5lyRk.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-D8EQIzja.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-CRE_cwP5.mjs";
import { v as resolveLoadedMemoryProviderKind } from "./memory-state-Cx8Kzhx0.mjs";
import { g as prepareModelRuntimeSnapshot, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-BvTeWKXf.mjs";
import { n as applyLocalNoAuthHeaderOverride, o as resolveModelAuthMode, t as applyAuthHeaderOverride } from "./model-auth-efmtIdn2.mjs";
import { l as estimateTokens } from "./compaction-BR_rsQOI.mjs";
import { i as sanitizeToolUseResultPairingForModel } from "./session-transcript-repair-CgGD_n-Q.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { h as redactTranscriptMessage } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { u as normalizeUsage } from "./usage-XmAH1cfG.mjs";
import { y as projectPublicSessionEntry } from "./session-accessor.sqlite-transcript-write-CPk6xFA-.mjs";
import { i as createDiagnosticEmbeddedRunOwner, r as closeDiagnosticEmbeddedRunOwner, u as markDiagnosticEmbeddedRunStarted } from "./diagnostic-run-activity-BlCpLag4.mjs";
import { b as resolveCompactionTimeoutMs, y as compactWithSafetyTimeout } from "./diagnostic-BC19O2Si.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { i as resolveSessionPermissionExecMode, t as SESSION_PERMISSION_BY_EXEC_MODE } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { i as describeFailoverError, r as coerceToFailoverError, s as hasModelFallbackStop } from "./failover-error-BZ8WG_0i.mjs";
import { t as runWithModelFallback } from "./model-fallback-runner-NPYj5LWB.mjs";
import { s as pickFallbackThinkingLevel } from "./embedded-agent-helpers-BEiSgw6S.mjs";
import { r as isFallbackSummaryError } from "./model-fallback-attempt-CgxC59Zt.mjs";
import { i as formatUnknownCompactionReasonDetail, r as classifyCompactionReason, s as resolveCompactionFailure } from "./request-error-facts-BJ7jRSET.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-HjIVcJaQ.mjs";
import { n as createBundleMcpToolRuntime } from "./agent-bundle-mcp-materialize-XNkPQvAz.mjs";
import "./agent-bundle-mcp-tools-BAc-juSa.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-DH0HB36b.mjs";
import { o as resolveUserTimezone, r as formatDateStamp } from "./date-time-DNFKWNdt.mjs";
import { n as resolveModelAsync } from "./model-CBr3I3EF.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-DqAHXeGv.mjs";
import { r as prepareAgentRuntimeAuth } from "./prepare-auth-CH_V05qh.mjs";
import { i as providerUsesCredentialScopedModelMetadata, o as resolveReusableRuntimeModelAuth, t as protectPreparedProviderRuntimeAuth } from "./provider-runtime-auth-protection-JDiHCVQl.mjs";
import { a as resolvePreparedRuntimeAuthAttempts, o as resolvePreparedRuntimeModelAuth } from "./simple-completion-runtime-CAU9mXql.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-l7Gq7Nji.mjs";
import { n as createOpenClawCodingToolsInternal } from "./agent-tools-CkKxECNx.mjs";
import { s as createSkillInstructionDeliveryCache } from "./agent-tools.read-DMtJ_zRT.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-2cvMG8cQ.mjs";
import { i as resolveChannelMessageToolHints, o as resolveChannelReactionGuidance } from "./channel-tools-BhIPLlm-.mjs";
import { n as filterRuntimeCompatibleTools, t as filterProviderNormalizableTools } from "./tool-schema-projection-D9z9oa3w.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-Hy3UfoZt.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { G as sanitizeSessionHistory, J as limitHistoryTurns, K as validateReplayTurns, _ as createPreparedEmbeddedAgentSettingsManager, _t as logRuntimeToolSchemaQuarantine, a as prepareAgentMemoryPrompt, c as collectRegisteredToolNames, d as isRealConversationMessage, g as setCompactionSafeguardCancellation, gt as prepareEmbeddedSkills, h as getCompactionSafeguardRuntime, ht as declarePromptHistoryRewrite, i as resolveAgentRunSessionTarget, l as toSessionToolAllowlist, lt as flushPendingToolResultsAfterIdle, m as consumeCompactionSafeguardCancellation, q as getHistoryLimitFromSessionKey, r as applyAgentRunSessionTargetIdentity, s as collectAllowedToolNames, u as buildEmbeddedExtensionFactories } from "./builtin-openclaw-DPSlekTi.mjs";
import { t as createBundleLspToolRuntime } from "./agent-bundle-lsp-runtime-BU3Q1HU3.mjs";
import { t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-Cc1ujrgp.mjs";
import { n as buildBootstrapBudgetState, r as buildBootstrapInjectionStats, s as buildBootstrapPromptWarningNotice } from "./bootstrap-budget-D83uJB7U.mjs";
import { a as getActiveMemoryProviderCore, o as getActiveMemorySearchManagerCore } from "./memory-runtime-B776pEel.mjs";
import { c as resolveContextInjectionMode, i as resolveBootstrapContextForRun, r as makeBootstrapWarn } from "./bootstrap-files-C4UH2yRG.mjs";
import { n as resolveSandboxContext } from "./context-BsEuTEPJ.mjs";
import "./sandbox-Ds9JeFO_.mjs";
import { t as applyExtraParamsToAgent } from "./extra-params-CWboB9pq.mjs";
import { l as prepareEmbeddedSessionActiveProjectKeys } from "./session-prompt-state-CQINGzpX.mjs";
import { f as estimateCompactedRequestTokens, i as agentSessionSetContextReplacementHook, o as setSessionModelUsageSink, r as agentSessionAutomaticCompaction, t as DefaultResourceLoader } from "./resource-loader-Cj2qTSi1.mjs";
import { n as createAgentSessionForEmbeddedRunner, r as guardSessionManager } from "./sdk-Gm0i9GqF.mjs";
import { t as rewriteTranscriptEntriesInSessionManager } from "./transcript-rewrite-ez8F94P3.mjs";
import { d as estimateLlmBoundaryTokenPressure, f as estimateRenderedLlmBoundaryTokenPressure } from "./settled-turn-finalization-result-BC1GuVZk.mjs";
import { n as mapThinkingLevelForProvider, r as normalizeContextTokenBudget, t as mapThinkingLevel } from "./utils-B61_oIEI.mjs";
import { _ as resolveEmbeddedCompactionThinkingLevel, g as resolveEmbeddedCompactionTarget, h as resolveCompactionTargetRuntime, l as resolvePromptModeForSession, m as resolveCompactionHarnessRuntime, p as resolveCompactionContextTokenBudget, y as listActiveProcessSessionReferences } from "./context-engine-maintenance-DDo1CHf0.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-BYInoSdz.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-7h3_PwTS.mjs";
import { t as SessionManager } from "./session-manager-fHN-UyrU.mjs";
import { n as withSessionManagerWrite } from "./session-manager-write-admission-BHoMWW_H.mjs";
import "./sessions-Bu3xipCf.mjs";
import { n as hasPersistedMedia } from "./user-turn-media-DxovqnvB.mjs";
import { a as resolveEmbeddedAgentStream, i as resolveEmbeddedAgentBaseStreamFn, r as resolveEmbeddedAgentApiKey, t as wrapStreamFnWithDiagnosticModelCallEvents } from "./attempt.model-diagnostic-events-B4swXaoG.mjs";
import { i as resolveAgentPromptSurfaceForSessionKey } from "./system-prompt-config-CnJZjjCb.mjs";
import { r as prepareWatchedSessionsPromptAsync } from "./watched-sessions-prompt-B1X_tmos.mjs";
import { r as resolveAttemptSpawnWorkspaceDir } from "./attempt-thread-helpers-9f6DmHCl.mjs";
import { t as registerProviderStreamForModel } from "./provider-stream-CaYgo23M.mjs";
import { a as resolveEffectiveCompactionMode, i as isSilentOverflowProneModel, n as applyAgentAutoCompactionGuard, r as applyAgentCompactionSettingsFromConfig } from "./agent-settings-Cfa6SYMN.mjs";
import { a as toToolDefinitions } from "./agent-tool-definition-adapter-v71e4SNl.mjs";
import { n as buildEmbeddedSystemPrompt, t as applySystemPromptToSession } from "./system-prompt-B54xRgv8.mjs";
import { t as isReasoningTagProvider } from "./provider-utils-Duqlxu7A.mjs";
import { r as resolveOpenClawReferencePaths } from "./docs-path-CRbzrTCx.mjs";
import { t as getMachineDisplayName } from "./machine-name-XEOScrzy.mjs";
import { n as resolveRuntimeAgentName, r as resolveSystemPromptRepoRoot } from "./system-prompt-params-CH6jpQWl.mjs";
import { r as resolveEmbeddedSandboxInfoExecPolicy, t as buildEmbeddedSandboxInfo } from "./sandbox-info-C5x6dLc2.mjs";
import { i as selectAgentHarnessForPreparedModelProviders, r as selectAgentHarness } from "./selection-CiYACV8E.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-BSESlB4y.mjs";
import { n as resolveMemorySearchIndexConfig } from "./memory-search-DFCytBn0.mjs";
import { n as buildAgentRuntimePlan, r as resolvePreparedProviderRuntimeHandle } from "./build-DSbSTb1i.mjs";
import { i as resolveRunWorkspaceDir, n as resolveCanonicalRunRuntimeWorkspace, r as resolveRootedRunRuntimeWorkspace } from "./workspace-run-DoWDi1TY.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import os from "node:os";
import { isDeepStrictEqual } from "node:util";
import { captureOpenAIResponsesCompaction, preserveCompactionReplayWindow, requestPreparedOpenAIResponsesCompaction, requiresCompactionReplayRefresh, resolveCompactionReplayEligibility, resolveOpenAIResponsesCompactEndpointPlan } from "@openclaw/ai/transports";
import { supportsNativeOpenAIResponsesEndpoint } from "@openclaw/ai/internal/openai-responses-payload-policy";
//#region src/agents/embedded-agent-runner/compaction-hooks.ts
async function runPostCompactionSessionMemorySync(params) {
	try {
		const agentId = resolveSessionAgentId({
			sessionKey: params.sessionKey,
			config: params.config,
			agentId: params.agentId
		});
		if (resolveLoadedMemoryProviderKind(params.config) === "native") {
			const sessionKey = params.sessionKey?.trim();
			const authority = params.memoryAudience && sessionKey ? {
				kind: "session",
				sessionKey,
				sessionId: params.sessionId?.trim() || void 0,
				sandboxed: params.sandboxed === true,
				audience: params.memoryAudience
			} : {
				kind: "host",
				operation: "post-compaction-refresh"
			};
			let provider = null;
			try {
				await params.assertActive?.();
				const acquired = await getActiveMemoryProviderCore({
					cfg: params.config,
					agentId,
					context: {
						authority,
						assertCurrent: () => {}
					}
				});
				provider = acquired.provider;
				await params.assertActive?.();
				if (!provider) {
					log.debug(`memory refresh denied (post-compaction) for ${acquired.providerId ?? "selected memory provider"}: ${acquired.error ?? "provider unavailable"}`);
					return;
				}
				if (!provider.refresh) {
					log.debug(`memory refresh unsupported (post-compaction) for ${acquired.providerId ?? "selected memory provider"}`);
					return;
				}
				await provider.refresh();
				await params.assertActive?.();
			} catch (error) {
				log.debug(`memory refresh failed (post-compaction): ${formatErrorMessage(error)}`);
			} finally {
				await provider?.close().catch(() => {});
			}
			return;
		}
		const resolvedMemory = resolveMemorySearchIndexConfig(params.config, agentId);
		if (!resolvedMemory || !resolvedMemory.sources.includes("sessions")) return;
		if (!resolvedMemory.sync.sessions.postCompactionForce) return;
		await params.assertActive?.();
		const { manager } = await getActiveMemorySearchManagerCore({
			cfg: params.config,
			agentId
		});
		await params.assertActive?.();
		if (!manager?.sync) return;
		const sessionId = params.sessionId?.trim();
		await manager.sync({
			reason: "post-compaction",
			...sessionId ? { sessions: [{
				agentId,
				sessionId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {}
			}] } : { archiveFiles: [params.sessionFile] }
		});
	} catch (err) {
		await params.assertActive?.();
		log.warn(`memory sync skipped (post-compaction): ${formatErrorMessage(err)}`);
	}
}
async function runPostCompactionSideEffects(params) {
	await params.assertActive?.();
	const sessionFile = params.sessionFile.trim();
	if (!sessionFile) return;
	emitSessionTranscriptUpdate({
		sessionFile,
		sessionKey: params.sessionKey,
		...params.sessionId ? { sessionId: params.sessionId } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	});
	await params.assertActive?.();
	const mode = params.config?.agents?.defaults?.compaction?.postIndexSync ?? "async";
	const syncTask = mode !== "off" && params.config ? runPostCompactionSessionMemorySync({
		...params,
		config: params.config,
		sessionFile
	}) : void 0;
	if (mode !== "await") syncTask?.catch((error) => {
		log.debug(`memory sync cancelled (post-compaction): ${formatErrorMessage(error)}`);
	});
	await (mode === "await" ? syncTask : void 0);
	await params.assertActive?.();
}
function estimateTokenCountSafe(messages, estimateTokensFn) {
	try {
		let total = 0;
		for (const message of messages) total += estimateTokensFn(message);
		return total;
	} catch {
		return;
	}
}
/** Builds before-hook metrics while tolerating providers that cannot estimate all messages. */
function buildBeforeCompactionHookMetrics(params) {
	return {
		messageCountOriginal: params.originalMessages.length,
		tokenCountOriginal: estimateTokenCountSafe(params.originalMessages, params.estimateTokensFn),
		messageCountBefore: params.currentMessages.length,
		tokenCountBefore: params.observedTokenCount ?? estimateTokenCountSafe(params.currentMessages, params.estimateTokensFn)
	};
}
/** Estimates compacted-session token count and rejects impossible growth from stale estimates. */
function estimateTokensAfterCompaction(params) {
	if (params.requestBudget) return estimateCompactedRequestTokens(params.messagesAfter, {
		...params.requestBudget,
		pendingTokens: 0
	});
	const tokensAfter = estimateTokenCountSafe(params.messagesAfter, params.estimateTokensFn);
	if (tokensAfter === void 0) return;
	const sanityCheckBaseline = params.observedTokenCount ?? params.fullSessionTokensBefore;
	if (sanityCheckBaseline > 0 && tokensAfter > (params.observedTokenCount !== void 0 ? sanityCheckBaseline : sanityCheckBaseline * 1.1)) return;
	return tokensAfter;
}
/** Internal hooks settle and forward messages before plugin hooks see the same phase. */
async function runCompactionHooks(params) {
	params.assertActive?.();
	try {
		const hookEvent = createInternalHookEvent("session", `compact:${params.phase}`, params.sessionKey, {
			sessionId: params.sessionId,
			missingSessionKey: false,
			...params.phase === "before" ? {
				messageCount: params.metrics.messageCountBefore,
				tokenCount: params.metrics.tokenCountBefore,
				messageCountOriginal: params.metrics.messageCountOriginal,
				tokenCountOriginal: params.metrics.tokenCountOriginal
			} : {
				messageCount: params.messageCountAfter,
				tokenCount: params.tokensAfter,
				compactedCount: params.compactedCount,
				summaryLength: params.summaryLength,
				tokensBefore: params.tokensBefore,
				tokensAfter: params.tokensAfter,
				firstKeptEntryId: params.firstKeptEntryId
			}
		});
		await triggerInternalHook(hookEvent);
		params.assertActive?.();
		if (hookEvent.messages.length > 0) await params.onHookMessages?.({
			phase: params.phase,
			messages: hookEvent.messages.slice(),
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		});
	} catch (err) {
		params.assertActive?.();
		log.warn(`session:compact:${params.phase} hook failed`, {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	params.assertActive?.();
	if (params.hookRunner?.hasHooks?.(`${params.phase}_compaction`)) try {
		const context = {
			sessionId: params.sessionId,
			agentId: params.sessionAgentId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir,
			messageProvider: params.messageProvider
		};
		if (params.phase === "before") await params.hookRunner.runBeforeCompaction?.({
			messageCount: params.metrics.messageCountBefore,
			tokenCount: params.metrics.tokenCountBefore
		}, context);
		else await params.hookRunner.runAfterCompaction?.({
			messageCount: params.messageCountAfter,
			tokenCount: params.tokensAfter,
			compactedCount: params.compactedCount,
			sessionFile: params.sessionFile,
			...params.previousSessionId ? { previousSessionId: params.previousSessionId } : {}
		}, context);
	} catch (err) {
		params.assertActive?.();
		log.warn(`${params.phase}_compaction hook failed`, {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	params.assertActive?.();
}
//#endregion
//#region src/agents/embedded-agent-runner/run/compaction-accounting-bridge.ts
const recorderByRuntimeContext = /* @__PURE__ */ new WeakMap();
function attachCompactionAccountingRecorder(runtimeContext, recorder) {
	recorderByRuntimeContext.set(runtimeContext, recorder);
}
function readCompactionAccountingRecorder(runtimeContext) {
	return runtimeContext ? recorderByRuntimeContext.get(runtimeContext) : void 0;
}
//#endregion
//#region src/agents/embedded-agent-runner/transcript-byte-preflight-authority.ts
const claims = resolveGlobalSingleton(Symbol.for("openclaw.transcriptBytePreflightClaims"), () => /* @__PURE__ */ new WeakMap());
function resolveTranscriptBytePreflightAuthority(harness) {
	try {
		return resolveCodexAgentHarnessNativeCompaction(harness) ? harness : void 0;
	} catch {
		return;
	}
}
function setTranscriptBytePreflightClaim(runtimeContext, authority, withCompactionPersistence, withCompactionPersistenceAsync) {
	if (!runtimeContext || !authority) return () => {};
	const target = runtimeContext.sessionTarget;
	const claim = {
		authority,
		...withCompactionPersistence ? { withCompactionPersistence } : {},
		...withCompactionPersistenceAsync ? { withCompactionPersistenceAsync } : {},
		sessionTarget: {
			agentId: target?.agentId,
			sessionId: target?.sessionId,
			sessionKey: target?.sessionKey,
			storePath: target?.storePath
		}
	};
	claims.set(runtimeContext, claim);
	return () => {
		if (claims.get(runtimeContext) === claim) claims.delete(runtimeContext);
	};
}
function consumeTranscriptBytePreflightClaim(params, sessionTarget, lockedHarnessRuntime) {
	const runtimeContext = params.contextEngineRuntimeContext;
	const claim = runtimeContext ? claims.get(runtimeContext) : void 0;
	if (!runtimeContext || !claim) return;
	const { authority, sessionTarget: expected } = claim;
	const active = resolveTranscriptBytePreflightAuthority(authority);
	claims.delete(runtimeContext);
	return (lockedHarnessRuntime ?? params.agentHarnessId) === authority.id && params.preflightRequired === true && params.preflightCompactionTrigger === "transcript_bytes" && params.trigger === "budget" && expected?.agentId === sessionTarget.agentId && expected.sessionId === sessionTarget.sessionId && expected.sessionKey === sessionTarget.sessionKey && expected.storePath === sessionTarget.storePath && active === authority ? claim : void 0;
}
//#endregion
//#region src/agents/project-memory-scope.ts
const MAX_PROJECT_KEY_CACHE_ENTRIES = 128;
const GIT_CONFIG_TIMEOUT_MS = 4e3;
const projectKeyByRepoRoot = new LruCache(MAX_PROJECT_KEY_CACHE_ENTRIES);
function escapeProjectKeyForAnnotation(value) {
	return value.replaceAll("%", "%25").replaceAll(";", "%3b").replaceAll("<", "%3c").replaceAll(">", "%3e").replaceAll("\r", "%0d").replaceAll("\n", "%0a");
}
async function resolveUncachedProjectKey(repoRoot) {
	try {
		const result = await runCommandWithTimeout([
			"git",
			"-C",
			repoRoot,
			"config",
			"--get",
			"remote.origin.url"
		], { timeoutMs: GIT_CONFIG_TIMEOUT_MS });
		if (result.code === 0) {
			const source = parseGitUrl(`git:${result.stdout.trim()}`);
			if (source) return escapeProjectKeyForAnnotation(`${source.host.toLowerCase()}/${source.path}`);
		}
	} catch {}
	return `path:${escapeProjectKeyForAnnotation(repoRoot)}`;
}
/** Resolve one stable repository identity without spawning Git again for the same root. */
function resolveProjectKey(repoRoot) {
	const canonicalRoot = path.resolve(repoRoot);
	const cached = projectKeyByRepoRoot.get(canonicalRoot);
	if (cached) return cached;
	const pending = resolveUncachedProjectKey(canonicalRoot);
	projectKeyByRepoRoot.set(canonicalRoot, pending);
	return pending;
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-runtime-preparation.ts
function projectCodexHostTranscriptBytePreflightConfig(config, active) {
	const compaction = config?.agents?.defaults?.compaction;
	if (!active || !compaction || !Object.hasOwn(compaction, "model") && !Object.hasOwn(compaction, "provider")) return config;
	const { model: _model, provider: _provider, ...projectedCompaction } = compaction;
	return {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...config.agents?.defaults,
				compaction: projectedCompaction
			}
		}
	};
}
/** Resolves the shared policy, target, and harness ownership for either compaction entry point. */
function resolveCompactionRuntimeSelection(params) {
	const runtimePolicySessionKey = params.sandboxSessionKey ?? params.sessionKey ?? void 0;
	const runtimePolicyAgentId = params.sandboxAgentId ?? (params.sandboxSessionKey && parseAgentSessionKey(params.sandboxSessionKey) ? void 0 : params.agentId);
	const policyTarget = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.modelId,
		authProfileId: params.authProfileId,
		modelSelectionLocked: params.modelSelectionLocked,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	const policyProvider = policyTarget.provider ?? "openai";
	const policyModelId = policyTarget.model ?? "gpt-6-astra";
	const policy = resolveAgentHarnessPolicy({
		provider: policyProvider,
		modelId: policyModelId,
		config: params.config,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey
	});
	const configuredHarnessRuntime = policy.runtimeSource && policy.runtimeSource !== "implicit" && !isDefaultAgentRuntimeId(policy.runtime) ? policy.runtime : void 0;
	const boundHarnessRuntime = normalizeOptionalAgentRuntimeId(params.boundHarnessRuntime);
	const selectedHarnessRuntime = params.selectedHarnessRuntime ?? resolveCompactionHarnessRuntime({
		boundHarnessRuntime,
		preparedRuntimePlan: params.preparedRuntimePlan,
		configuredHarnessRuntime,
		provider: policyProvider,
		modelId: policyModelId
	});
	const target = {
		...policyTarget,
		...resolveCompactionTargetRuntime(policyTarget.provider, selectedHarnessRuntime)
	};
	const provider = target.provider ?? "openai";
	const modelId = target.model ?? "gpt-6-astra";
	const selectedRuntime = normalizeOptionalAgentRuntimeId(selectedHarnessRuntime);
	return {
		attemptNativeHarnessCompaction: Boolean(selectedRuntime && selectedRuntime !== "auto" && selectedRuntime !== "openclaw" && (!isOpenAIProvider(provider) || target.nativeHarnessCompaction === true)),
		runtimePolicySessionKey,
		runtimePolicyAgentId,
		boundHarnessRuntime,
		selectedHarnessRuntime,
		selectedHarnessRuntimeOverride: boundHarnessRuntime ? void 0 : selectedHarnessRuntime,
		target,
		runtimeModelAuth: resolveReusableRuntimeModelAuth({
			plan: params.runtimeAuthPlan ?? params.preparedRuntimePlan?.auth,
			provider,
			modelId,
			authProfileId: target.authProfileId
		}),
		provider,
		runtimeProvider: target.runtimeProvider ?? provider,
		contextConfigProvider: target.contextProvider ?? provider,
		modelId
	};
}
/** Prepares one ordered auth-attempt set and converges it on a single compaction harness. */
async function prepareCompactionHarnessAuth(params) {
	const runtimeAuthProfileStore = isOpenAIProvider(params.provider) ? ensureAuthProfileStore(params.agentDir, {
		profileId: params.authProfileId ?? params.reusableRuntimeAuthPlan?.forwardedAuthProfileId,
		externalCliProviderIds: ["openai"],
		allowKeychainPrompt: false
	}) : ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, {
		profileId: params.authProfileId ?? params.reusableRuntimeAuthPlan?.forwardedAuthProfileId,
		allowKeychainPrompt: false
	});
	const harnessSelectionParams = {
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		agentId: params.runtimePolicyAgentId,
		sessionKey: params.runtimePolicySessionKey ?? void 0,
		agentHarnessId: params.agentHarnessId,
		agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride
	};
	const selectPreparedHarness = (attempts) => selectAgentHarnessForPreparedModelProviders({
		...harnessSelectionParams,
		modelProviders: attempts.map((attempt) => projectPreparedModelProvider({
			model: params.model,
			plan: attempt.plan,
			attemptKind: attempt.kind
		}))
	});
	const initialHarness = params.reusableRuntimeAuthPlan ? void 0 : selectAgentHarness({
		...harnessSelectionParams,
		modelProvider: projectPreparedModelProvider({ model: params.model })
	});
	const prepare = (harness) => {
		try {
			return {
				ok: true,
				auth: prepareAgentRuntimeAuth({
					provider: params.provider,
					modelId: params.modelId,
					modelApi: params.model?.api,
					modelBaseUrl: params.model?.baseUrl,
					config: params.config,
					agentId: params.runtimePolicyAgentId,
					env: process.env,
					agentDir: params.agentDir,
					workspaceDir: params.workspaceDir,
					authProfileStore: runtimeAuthProfileStore,
					sessionAuthProfileId: params.authProfileId,
					sessionAuthProfileSource: params.authProfileIdSource,
					harnessId: harness.id,
					harnessRuntime: harness.id,
					harnessAuthBootstrap: harness.authBootstrap
				})
			};
		} catch (error) {
			if (isAbortError(error)) throw error;
			return {
				ok: false,
				error
			};
		}
	};
	const initialAuth = params.reusableRuntimeAuthPlan ? {
		ok: true,
		auth: {
			plan: params.reusableRuntimeAuthPlan,
			attempts: [{
				kind: "implicit",
				plan: params.reusableRuntimeAuthPlan
			}]
		}
	} : prepare(initialHarness);
	if (!initialAuth.ok) return initialAuth;
	let runtimeAuthPreparation = initialAuth.auth;
	let selectedPreparedHarness = selectPreparedHarness(runtimeAuthPreparation.attempts);
	if (!params.reusableRuntimeAuthPlan && selectedPreparedHarness.id !== initialHarness?.id) {
		const preparedAuth = prepare(selectedPreparedHarness);
		if (!preparedAuth.ok) return preparedAuth;
		runtimeAuthPreparation = preparedAuth.auth;
		const confirmedHarness = selectPreparedHarness(runtimeAuthPreparation.attempts);
		if (confirmedHarness.id !== selectedPreparedHarness.id) throw new Error(`${params.convergenceErrorPrefix ?? "Prepared compaction"} auth routes did not converge on one agent harness for ${params.provider}/${params.modelId}.`);
		selectedPreparedHarness = confirmedHarness;
	}
	return {
		ok: true,
		runtimeAuthProfileStore,
		runtimeAuthPreparation,
		selectedPreparedHarness,
		providerUsesProfileScopedModelMetadata: providerUsesCredentialScopedModelMetadata({
			provider: params.metadataProvider ?? params.provider,
			modelId: params.modelId,
			config: params.config,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		})
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-diagnostics.ts
function createDirectCompactionDiagId() {
	return `cmp-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}
function getMessageTextChars(msg) {
	const content = msg.content;
	if (typeof content === "string") return content.length;
	return Array.isArray(content) ? content.reduce((total, block) => {
		const text = block && typeof block === "object" ? block.text : void 0;
		return total + (typeof text === "string" ? text.length : 0);
	}, 0) : 0;
}
function resolveMessageToolLabel(msg) {
	const candidate = msg.toolName ?? msg.name ?? msg.tool;
	return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : void 0;
}
function summarizeCompactionMessages(messages) {
	let historyTextChars = 0;
	let toolResultChars = 0;
	const contributors = [];
	let estTokens = 0;
	let tokenEstimationFailed = false;
	for (const msg of messages) {
		const role = typeof msg.role === "string" ? msg.role : "unknown";
		const chars = getMessageTextChars(msg);
		historyTextChars += chars;
		if (role === "toolResult") toolResultChars += chars;
		contributors.push({
			role,
			chars,
			tool: resolveMessageToolLabel(msg)
		});
		if (!tokenEstimationFailed) try {
			estTokens += estimateTokens(msg);
		} catch {
			tokenEstimationFailed = true;
		}
	}
	return {
		messages: messages.length,
		historyTextChars,
		toolResultChars,
		estTokens: tokenEstimationFailed ? void 0 : estTokens,
		contributors: contributors.toSorted((left, right) => right.chars - left.chars).slice(0, 3)
	};
}
function containsRealConversationMessages(messages) {
	return messages.some((message, index, allMessages) => isRealConversationMessage(message, allMessages, index));
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-duplicate-user-messages.ts
const DUPLICATE_USER_MESSAGE_WINDOW_MS = 6e4;
const MIN_DUPLICATE_USER_MESSAGE_CHARS = 24;
function normalizeUserMessageContent(content) {
	if (typeof content === "string") return content.replace(/\s+/g, " ").trim();
	if (!Array.isArray(content)) return;
	const textParts = [];
	for (const block of content) {
		if (!isRecord(block) || block.type === "image") return;
		if (block.type === "text" && typeof block.text === "string") textParts.push(block.text);
	}
	return textParts.join("\n").replace(/\s+/g, " ").trim();
}
function duplicateSignature(message) {
	if (!isRecord(message) || message.role !== "user" || typeof message.timestamp !== "number") return;
	const text = normalizeUserMessageContent(message.content);
	if (!text || text.length < MIN_DUPLICATE_USER_MESSAGE_CHARS || hasPersistedMedia(message)) return;
	const metadata = message["__openclaw"];
	const senderId = isRecord(metadata) && typeof metadata.senderId === "string" ? metadata.senderId : "";
	return {
		key: JSON.stringify([senderId, text.normalize("NFC")]),
		timestamp: message.timestamp
	};
}
/** Drop later duplicate user messages while preserving the first prompt. */
function dedupeDuplicateUserMessagesForCompaction(messages) {
	const lastSeenAtByKey = /* @__PURE__ */ new Map();
	const result = [];
	for (const message of messages) {
		const signature = duplicateSignature(message);
		if (!signature) {
			if (message.role === "assistant") lastSeenAtByKey.clear();
			result.push(message);
			continue;
		}
		const lastSeenAt = lastSeenAtByKey.get(signature.key);
		const newestTimestamp = Math.max(lastSeenAt ?? signature.timestamp, signature.timestamp);
		lastSeenAtByKey.set(signature.key, newestTimestamp);
		if (typeof lastSeenAt === "number" && signature.timestamp >= lastSeenAt && signature.timestamp - lastSeenAt <= DUPLICATE_USER_MESSAGE_WINDOW_MS) continue;
		result.push(message);
	}
	return result;
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-session-agent.ts
async function prepareCompactionSessionAgent(params) {
	const transportApiKey = params.authStorage ? await resolveEmbeddedAgentApiKey({
		provider: params.effectiveModel.provider,
		resolvedApiKey: params.resolvedApiKey,
		authStorage: params.authStorage
	}) : params.resolvedApiKey;
	params.session.agent.streamFn = resolveEmbeddedAgentStream({
		llmRuntime: params.llmRuntime,
		currentStreamFn: resolveEmbeddedAgentBaseStreamFn({ session: params.session }),
		providerStreamFn: params.providerStreamFn,
		sessionId: params.sessionId,
		signal: params.signal,
		model: params.effectiveModel,
		resolvedApiKey: params.resolvedApiKey,
		transportAuthAvailable: Boolean(transportApiKey?.trim()),
		authProfileId: params.runtimePlan?.auth.forwardedAuthProfileId,
		authStorage: params.authStorage
	}).streamFn;
	const providerTextTransforms = resolveProviderTextTransforms({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.effectiveWorkspace,
		runtimeHandle: getModelProviderRuntimePluginHandle(params.effectiveModel)
	});
	if (providerTextTransforms) params.session.agent.streamFn = wrapStreamFnTextTransforms({
		streamFn: params.session.agent.streamFn,
		input: providerTextTransforms.input,
		output: providerTextTransforms.output,
		transformSystemPrompt: false
	});
	const providerThinkingLevel = mapThinkingLevelForProvider(params.thinkLevel, params.effectiveModel);
	const preparedRuntimeExtraParams = params.runtimePlan?.transport.resolveExtraParams({
		thinkingLevel: providerThinkingLevel,
		agentId: params.sessionAgentId,
		workspaceDir: params.effectiveWorkspace,
		model: params.effectiveModel
	});
	return {
		...applyExtraParamsToAgent(params.session.agent, params.config, params.provider, params.modelId, void 0, providerThinkingLevel, params.sessionAgentId, params.effectiveWorkspace, params.effectiveModel, params.agentDir, void 0, {
			...preparedRuntimeExtraParams ? { preparedExtraParams: preparedRuntimeExtraParams } : {},
			auth: params.runtimePlan?.auth.selectedAuthMode ? {
				mode: params.runtimePlan.auth.selectedAuthMode,
				authFlow: params.runtimePlan.auth.selectedAuthFlow
			} : void 0,
			nativeWebSearchPolicyContext: {
				webSearchEnabled: false,
				runtimeToolAllowlist: []
			}
		}),
		transportApiKey
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/server-endpoint-compaction.ts
/** Try provider-owned compaction and persist its replay checkpoint on the session owner. */
async function attemptServerEndpointCompaction(params) {
	if (params.trigger === "overflow" || params.customInstructions?.trim() || !resolveOpenAIResponsesCompactEndpointPlan(params.model, params.extraParams).enabled) return;
	params.assertActive?.();
	let compacted;
	let compactionCommitted = false;
	try {
		const messages = params.context.messages.filter((message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult");
		if (messages.at(-1)?.role !== "assistant") {
			log.warn("Responses compact endpoint skipped: history does not end with an assistant message; using client compaction");
			return;
		}
		if (requiresCompactionReplayRefresh(messages, params.model, params.requestOptions)) {
			log.warn("Responses compact endpoint skipped: the stored checkpoint needs a full-history rebuild; using client compaction");
			return;
		}
		const windowSource = findEndpointWindowRedactionSource(params);
		if (windowSource) {
			log.warn(`Responses compact endpoint skipped: its ${windowSource} would require transcript redaction in the stored window; using client compaction`);
			return;
		}
		const owner = params.sessionManager.getBranch().findLast((entry) => entry.type === "message" && entry.message.role === "assistant");
		if (!owner || owner.type !== "message" || owner.message.role !== "assistant") throw new Error("Responses compact endpoint requires a persisted assistant owner");
		compacted = await compactWithSafetyTimeout((signal) => requestPreparedOpenAIResponsesCompaction(params.streamFn, params.model, {
			systemPrompt: params.context.systemPrompt,
			messages
		}, {
			...params.requestOptions,
			signal
		}), params.requestOptions.timeoutMs, params.requestOptions.signal ? { abortSignal: params.requestOptions.signal } : void 0);
		params.onUsage?.(compacted.usage);
		params.assertActive?.();
		const replacement = structuredClone(owner.message);
		captureOpenAIResponsesCompaction(replacement, compacted.item, compacted.historyMode === "retained-users" ? "retained-users" : replacement.content.length, compacted.model, compacted.replayMetadata, compacted.output);
		if (params.trigger === "budget" && params.requestBudget) {
			const budget = params.requestBudget;
			const replacementTokens = estimateLlmBoundaryTokenPressure({
				messages: [replacement],
				prompt: "",
				replay: {
					model: params.model,
					sessionId: params.requestOptions.sessionId,
					authProfileId: params.requestOptions.authProfileId
				}
			}) - estimateRenderedLlmBoundaryTokenPressure({ prompt: "" });
			if (replacementTokens + budget.fixedTokens + budget.pendingTokens > budget.contextWindow - budget.reserveTokens) {
				log.warn(`Responses compact endpoint result discarded: returned window does not fit the request budget (windowTokens=${replacementTokens}); using client compaction`);
				return;
			}
		}
		const redacted = redactTranscriptMessage(replacement, params.config);
		if (redacted.role !== "assistant" || !isDeepStrictEqual(redacted.providerReplay, replacement.providerReplay)) throw new Error("Responses compact endpoint window requires transcript redaction");
		await withSessionManagerWrite(params.sessionManager, async () => {
			params.requestOptions.signal?.throwIfAborted();
			params.assertActive?.();
			const rewritten = await rewriteTranscriptEntriesInSessionManager({
				sessionManager: params.sessionManager,
				replacements: [{
					entryId: owner.id,
					message: redacted
				}],
				preserveReplacementCompactionReplay: true
			});
			if (replacement.providerReplay?.data !== compacted.item.encrypted_content || !rewritten.changed) throw new Error(`Responses compact endpoint checkpoint was not persisted: ${rewritten.reason}`);
			compactionCommitted = true;
			params.onCompactionCommitted?.(compacted.usage.input_tokens);
		});
	} catch (err) {
		if (compactionCommitted) throw err;
		params.assertActive?.();
		log.warn(`Responses compact endpoint failed; falling back to client compaction: ${formatErrorMessage(err)}`);
		return;
	}
	return compacted;
}
/** Name the first request source the endpoint may retain that redaction would rewrite. */
function findEndpointWindowRedactionSource(params) {
	if (params.context.systemPrompt && !supportsNativeOpenAIResponsesEndpoint(params.model)) {
		const prompt = {
			role: "user",
			content: params.context.systemPrompt,
			timestamp: 0
		};
		if (redactTranscriptMessage(prompt, params.config) !== prompt) return "system prompt";
	}
	return params.context.messages.some((message) => message.role === "user" && redactTranscriptMessage(message, params.config) !== message) ? "user message" : void 0;
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-session-execution.ts
async function executePreparedCompactionSession(runtime) {
	const { params, diagId, trigger, attempt, maxAttempts, runId, compactionModelCallTrace, diagnosticCompactionRunId, nextDiagnosticModelCallId, agentDir, provider, modelId, attemptedThinking, fail, authStorage, modelRegistry, apiKeyInfo, hasRuntimeAuthExchange, sandboxSessionKey, sandbox, effectiveWorkspace, effectiveCwd, contextTokenBudget, effectiveModel, runtimePlan, runtimePlanModelContext, runAbortController, effectiveTools, allowedToolNames, buildSystemPromptText, resolvedMessageProvider, sessionAgentId } = runtime;
	let thinkLevel = runtime.thinkLevel;
	let compactionSessionManager = null;
	try {
		const compactionTimeoutMs = resolveCompactionTimeoutMs(params.config);
		const accountingRecorder = readCompactionAccountingRecorder(params.contextEngineRuntimeContext);
		const memoryTranscript = accountingRecorder?.memoryTranscript;
		const sessionTarget = memoryTranscript?.sessionTarget ?? await resolveAgentRunSessionTarget({
			agentId: sessionAgentId,
			config: params.config,
			missingSessionKey: "resolve-existing",
			sessionFile: params.sessionFile,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionTarget: params.sessionTarget
		});
		const recordCompaction = accountingRecorder?.recordCompaction ?? (() => declarePromptHistoryRewrite({
			...sessionTarget,
			reason: "compaction"
		}));
		const assertActive = memoryTranscript?.assertActive ?? captureOwnedTranscriptWriteAssertion(sessionTarget);
		assertActive();
		const transcriptPolicy = runtimePlan.transcript.resolvePolicy(runtimePlanModelContext);
		const preparedSessionManager = memoryTranscript?.sessionManager ?? await SessionManager.openAsync(sessionTarget, void 0, void 0, params.abortSignal);
		assertActive();
		const responsesApi = effectiveModel.api === "openai-responses" || effectiveModel.api === "azure-openai-responses" || effectiveModel.api === "openai-chatgpt-responses";
		const sessionManager = guardSessionManager(preparedSessionManager, {
			agentId: sessionAgentId,
			runId: params.runId,
			sessionKey: params.sessionKey,
			config: params.config,
			contextWindowTokens: contextTokenBudget,
			allowSyntheticToolResults: transcriptPolicy.allowSyntheticToolResults,
			missingToolResultText: responsesApi ? "aborted" : void 0,
			allowedToolNames,
			withCompactionPersistence: params.transcriptByteCompactionPersistence,
			withCompactionPersistenceAsync: params.transcriptByteCompactionPersistenceAsync
		});
		compactionSessionManager = sessionManager;
		const recordUsage = accountingRecorder?.recordUsage ? (usage) => {
			const normalized = normalizeUsage(usage);
			if (normalized) accountingRecorder.recordUsage?.(normalized);
		} : void 0;
		if (recordUsage) setSessionModelUsageSink(sessionManager, recordUsage);
		const settingsManager = createPreparedEmbeddedAgentSettingsManager({
			cwd: effectiveCwd,
			agentDir,
			cfg: params.config,
			pluginMetadataSnapshot: getCurrentPluginMetadataSnapshot({
				config: params.config,
				env: process.env,
				workspaceDir: effectiveWorkspace
			}),
			contextTokenBudget
		});
		const extensionFactories = buildEmbeddedExtensionFactories({
			cfg: params.config,
			sessionManager,
			provider,
			modelId,
			model: effectiveModel,
			contextTokenBudget,
			agentId: sessionAgentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey ?? sandboxSessionKey,
			runId
		});
		const resourceLoader = new DefaultResourceLoader({
			cwd: effectiveCwd,
			agentDir,
			settingsManager,
			extensionFactories
		});
		await resourceLoader.reload();
		applyAgentCompactionSettingsFromConfig({
			settingsManager,
			cfg: params.config,
			contextTokenBudget
		});
		applyAgentAutoCompactionGuard({
			settingsManager,
			silentOverflowProneProvider: isSilentOverflowProneModel({
				provider,
				modelId,
				baseUrl: effectiveModel.baseUrl ?? void 0
			})
		});
		const customTools = toToolDefinitions(effectiveTools, {
			agentId: sessionAgentId,
			config: params.config,
			cwd: effectiveCwd,
			sessionKey: sandboxSessionKey,
			sessionId: params.sessionId,
			runId: params.runId,
			channelId: params.currentChannelId
		}, void 0);
		const sessionToolAllowlist = toSessionToolAllowlist(collectRegisteredToolNames(customTools));
		const providerStreamFn = registerProviderStreamForModel({
			model: effectiveModel,
			cfg: params.config,
			agentDir,
			workspaceDir: effectiveWorkspace,
			apiRegistry: getModelRegistryRuntime(modelRegistry).apiRegistry
		});
		while (true) {
			setCompactionSafeguardCancellation(sessionManager, void 0);
			attemptedThinking.add(thinkLevel);
			const systemPromptText = buildSystemPromptText();
			let session;
			let diagnosticOwner;
			let resetCompactionTimeout;
			try {
				session = (await createAgentSessionForEmbeddedRunner({
					cwd: effectiveCwd,
					agentDir,
					authStorage,
					modelRegistry,
					model: effectiveModel,
					thinkingLevel: mapThinkingLevel(mapThinkingLevelForProvider(thinkLevel, effectiveModel)),
					tools: sessionToolAllowlist,
					customTools,
					sessionManager,
					settingsManager,
					resourceLoader
				}, {})).session;
				session[agentSessionSetContextReplacementHook]((tokensAfter, tokensBefore) => recordCompaction({
					tokensBefore,
					tokensAfter,
					compactionKind: "context-engine"
				}), assertActive);
				session.setActiveToolsByName(sessionToolAllowlist);
				applySystemPromptToSession(session, systemPromptText);
				const { effectiveExtraParams, transportApiKey } = await prepareCompactionSessionAgent({
					session,
					llmRuntime: getModelRegistryRuntime(modelRegistry).llmRuntime,
					providerStreamFn,
					sessionId: params.sessionId,
					signal: runAbortController.signal,
					effectiveModel,
					resolvedApiKey: hasRuntimeAuthExchange ? void 0 : apiKeyInfo?.apiKey,
					authStorage,
					config: params.config,
					provider,
					modelId,
					thinkLevel,
					sessionAgentId,
					effectiveWorkspace,
					agentDir,
					runtimePlan
				});
				const compactionReplayEnabled = resolveCompactionReplayEligibility(effectiveModel, {
					extraParams: effectiveExtraParams,
					apiKey: transportApiKey
				});
				diagnosticOwner = createDiagnosticEmbeddedRunOwner({
					sessionId: params.sessionId,
					...params.sessionKey ? { sessionKey: params.sessionKey } : {},
					runId: diagnosticCompactionRunId,
					workKey: diagnosticCompactionRunId
				});
				markDiagnosticEmbeddedRunStarted({
					...diagnosticOwner,
					owner: diagnosticOwner
				});
				session.agent.streamFn = wrapStreamFnWithDiagnosticModelCallEvents(session.agent.streamFn, {
					config: params.config,
					runId: diagnosticCompactionRunId,
					...params.sessionKey && { sessionKey: params.sessionKey },
					sessionId: params.sessionId,
					provider,
					model: modelId,
					api: effectiveModel.api,
					transport: session.agent.transport,
					requestTimeoutMs: compactionTimeoutMs,
					contextTokenBudget,
					trace: compactionModelCallTrace,
					contentCapture: resolveDiagnosticModelContentCapturePolicy(params.config),
					nextCallId: nextDiagnosticModelCallId,
					ownerGeneration: diagnosticOwner.generation,
					onStarted: () => {
						resetCompactionTimeout?.();
						params.compactionTimeoutReset?.();
					}
				});
				const prior = await sanitizeSessionHistory({
					messages: session.messages,
					modelApi: effectiveModel.api,
					modelId,
					provider,
					allowedToolNames,
					config: params.config,
					workspaceDir: effectiveWorkspace,
					env: process.env,
					model: effectiveModel,
					sessionManager,
					sessionId: params.sessionId,
					policy: transcriptPolicy,
					preserveLatestAssistantThinking: false
				});
				const dedupedValidated = dedupeDuplicateUserMessagesForCompaction(await validateReplayTurns({
					messages: prior,
					modelApi: effectiveModel.api,
					modelId,
					provider,
					config: params.config,
					workspaceDir: effectiveWorkspace,
					env: process.env,
					model: effectiveModel,
					sessionId: params.sessionId,
					policy: transcriptPolicy
				}));
				session.agent.state.messages = dedupedValidated;
				const originalMessages = session.messages.slice();
				const truncated = preserveCompactionReplayWindow(originalMessages, limitHistoryTurns(session.messages, getHistoryLimitFromSessionKey(params.sessionKey, params.config, {
					accountId: params.agentAccountId,
					peerId: params.conversationRoutePeerId,
					chatType: params.chatType
				})), effectiveModel, {
					sessionId: params.sessionId,
					authProfileId: runtimePlan.auth.forwardedAuthProfileId,
					enabled: compactionReplayEnabled
				});
				const limited = transcriptPolicy.repairToolUseResultPairing ? sanitizeToolUseResultPairingForModel(truncated, responsesApi) : truncated;
				if (limited.length > 0) session.agent.state.messages = limited;
				const hookRunner = getGlobalHookRunner();
				const observedTokenCount = normalizeContextTokenBudget(params.currentTokenCount);
				const beforeHookMetrics = buildBeforeCompactionHookMetrics({
					originalMessages,
					currentMessages: session.messages,
					observedTokenCount,
					estimateTokensFn: estimateTokens
				});
				const hookSessionKey = sessionTarget.sessionKey;
				await runCompactionHooks({
					phase: "before",
					hookRunner,
					sessionId: params.sessionId,
					sessionKey: hookSessionKey,
					sessionAgentId,
					workspaceDir: effectiveWorkspace,
					messageProvider: resolvedMessageProvider,
					metrics: beforeHookMetrics,
					assertActive,
					onHookMessages: params.onCompactionHookMessages
				});
				const { messageCountOriginal, tokenCountBefore: limitedTranscriptTokensBefore } = beforeHookMetrics;
				const diagEnabled = log.isEnabled("debug");
				const preMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
				if (preMetrics) {
					log.debug(`[compaction-diag] start runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} pre.messages=${preMetrics.messages} pre.historyTextChars=${preMetrics.historyTextChars} pre.toolResultChars=${preMetrics.toolResultChars} pre.estTokens=${preMetrics.estTokens ?? "unknown"}`);
					log.debug(`[compaction-diag] contributors diagId=${diagId} top=${JSON.stringify(preMetrics.contributors)}`);
				}
				if (!containsRealConversationMessages(session.messages)) {
					log.info(`[compaction] skipping — no real conversation messages (sessionKey=${params.sessionKey ?? params.sessionId})`);
					return {
						ok: true,
						compacted: false,
						reason: "no real conversation messages"
					};
				}
				const compactStartedAt = Date.now();
				params.compactionTimeoutReset?.();
				let serverTokensAfter;
				const recordServerCompaction = (tokensBefore) => {
					serverTokensAfter = estimateLlmBoundaryTokenPressure({
						messages: sessionManager.buildSessionContext().messages,
						systemPrompt: systemPromptText,
						prompt: "",
						replay: {
							model: effectiveModel,
							sessionId: params.sessionId,
							authProfileId: runtimePlan.auth.forwardedAuthProfileId,
							enabled: compactionReplayEnabled
						}
					});
					recordCompaction({
						tokensBefore,
						tokensAfter: serverTokensAfter,
						compactionKind: "server-endpoint"
					});
				};
				const serverResult = params.transcriptBytePreflightAuthority ? void 0 : await attemptServerEndpointCompaction({
					trigger,
					streamFn: session.agent.streamFn,
					model: effectiveModel,
					context: {
						systemPrompt: systemPromptText,
						messages: session.messages
					},
					sessionManager,
					extraParams: effectiveExtraParams,
					requestBudget: accountingRecorder?.requestBudget,
					customInstructions: params.customInstructions,
					config: params.config,
					onUsage: recordUsage,
					onCompactionCommitted: recordServerCompaction,
					assertActive,
					requestOptions: {
						apiKey: transportApiKey,
						sessionId: params.sessionId,
						authProfileId: runtimePlan.auth.forwardedAuthProfileId,
						timeoutMs: compactionTimeoutMs,
						signal: params.abortSignal
					}
				});
				const activeSession = session;
				let clientResult;
				if (!serverResult) try {
					params.compactionTimeoutReset?.();
					const outcome = await compactWithSafetyTimeout(async (_signal, resetTimeout) => {
						resetCompactionTimeout = resetTimeout;
						setCompactionSafeguardCancellation(compactionSessionManager, void 0);
						const requestState = accountingRecorder?.pendingRequestState ?? (trigger === "overflow" ? "unresolved" : void 0);
						if (trigger === "manual") return {
							status: "completed",
							result: await activeSession.compact(params.customInstructions)
						};
						return activeSession[agentSessionAutomaticCompaction](params.customInstructions, requestState, resolveEffectiveCompactionMode(params.config) === "default" ? void 0 : "none", {
							requestBudget: accountingRecorder?.requestBudget,
							pendingUserEntryId: accountingRecorder?.pendingUserEntryId
						});
					}, compactionTimeoutMs, {
						abortSignal: params.abortSignal,
						onCancel: () => activeSession.abortCompaction()
					});
					if (outcome.status === "skipped") {
						assertActive();
						return {
							ok: true,
							compacted: false,
							reason: outcome.reason
						};
					}
					clientResult = outcome.result;
				} finally {
					resetCompactionTimeout = void 0;
				}
				params.compactionTimeoutReset?.();
				const effectiveFirstKeptEntryId = clientResult?.firstKeptEntryId;
				const tokensBefore = serverResult?.usage.input_tokens ?? clientResult.tokensBefore;
				const tokensAfter = serverResult ? serverTokensAfter : estimateTokensAfterCompaction({
					messagesAfter: session.messages,
					observedTokenCount,
					fullSessionTokensBefore: limitedTranscriptTokensBefore ?? 0,
					estimateTokensFn: estimateTokens,
					requestBudget: accountingRecorder?.requestBudget
				});
				const messageCountAfter = session.messages.length;
				const compactedCount = Math.max(0, messageCountOriginal - messageCountAfter);
				const activeSessionFile = memoryTranscript ? params.sessionFile : formatSqliteSessionFileMarker({
					...sessionTarget,
					sessionId: params.sessionId
				});
				if (!memoryTranscript) await runPostCompactionSideEffects({
					config: params.config,
					sessionKey: params.sessionKey,
					sessionId: params.sessionId,
					agentId: sessionAgentId,
					memoryAudience: params.memoryAudience,
					sandboxed: sandbox?.enabled === true,
					sessionFile: activeSessionFile,
					assertActive
				});
				const postMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
				if (preMetrics && postMetrics) log.debug(`[compaction-diag] end runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} outcome=compacted reason=none durationMs=${Date.now() - compactStartedAt} retrying=false post.messages=${postMetrics.messages} post.historyTextChars=${postMetrics.historyTextChars} post.toolResultChars=${postMetrics.toolResultChars} post.estTokens=${postMetrics.estTokens ?? "unknown"} delta.messages=${postMetrics.messages - preMetrics.messages} delta.historyTextChars=${postMetrics.historyTextChars - preMetrics.historyTextChars} delta.toolResultChars=${postMetrics.toolResultChars - preMetrics.toolResultChars} delta.estTokens=${typeof preMetrics.estTokens === "number" && typeof postMetrics.estTokens === "number" ? postMetrics.estTokens - preMetrics.estTokens : "unknown"}`);
				await runCompactionHooks({
					phase: "after",
					hookRunner,
					sessionId: params.sessionId,
					sessionAgentId,
					sessionKey: hookSessionKey,
					workspaceDir: effectiveWorkspace,
					messageProvider: resolvedMessageProvider,
					messageCountAfter,
					tokensAfter,
					compactedCount,
					sessionFile: activeSessionFile,
					summaryLength: clientResult?.summary.length,
					tokensBefore,
					firstKeptEntryId: effectiveFirstKeptEntryId,
					assertActive,
					onHookMessages: params.onCompactionHookMessages
				});
				const resultSessionTarget = {
					agentId: sessionTarget.agentId,
					sessionId: sessionTarget.sessionId,
					sessionKey: sessionTarget.sessionKey,
					storePath: sessionTarget.storePath
				};
				if (params.sessionTarget?.threadId !== void 0) resultSessionTarget.threadId = params.sessionTarget.threadId;
				return {
					ok: true,
					compacted: true,
					...serverResult ? { compactionKind: "server-endpoint" } : {},
					result: {
						sessionTarget: resultSessionTarget,
						...clientResult ? {
							summary: clientResult.summary,
							firstKeptEntryId: clientResult.firstKeptEntryId
						} : { kind: "server-endpoint" },
						tokensBefore: serverResult ? tokensBefore : observedTokenCount ?? clientResult.tokensBefore,
						tokensAfter,
						details: serverResult ? {
							compactionKind: "server-endpoint",
							droppedMessageCount: serverResult.usage.dropped_message_count
						} : clientResult.details
					}
				};
			} catch (err) {
				const failure = resolveCompactionFailure({
					error: err,
					safeguardCancellation: getCompactionSafeguardRuntime(sessionManager)?.cancellation,
					abortSignal: params.abortSignal
				});
				assertActive();
				const fallbackThinking = pickFallbackThinkingLevel({
					message: formatErrorMessage(failure.error),
					attempted: attemptedThinking
				});
				if (fallbackThinking) {
					log.warn(`[compaction] request rejected for ${provider}/${modelId}; retrying with ${fallbackThinking}`);
					thinkLevel = fallbackThinking;
					params.compactionTimeoutReset?.();
					continue;
				}
				throw err;
			} finally {
				if (diagnosticOwner) closeDiagnosticEmbeddedRunOwner(diagnosticOwner);
				try {
					await flushPendingToolResultsAfterIdle({
						agent: session?.agent,
						sessionManager,
						abortSignal: params.abortSignal
					});
				} catch {}
				try {
					session?.dispose();
				} catch {}
			}
		}
	} catch (err) {
		const failure = resolveCompactionFailure({
			error: err,
			safeguardCancellation: consumeCompactionSafeguardCancellation(compactionSessionManager),
			abortSignal: params.abortSignal
		});
		return fail(failure.reason, failure.error);
	} finally {
		setSessionModelUsageSink(compactionSessionManager, null);
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/model-resolution.ts
/** Resolves embedded-run models through discovery first, then the prepared static catalog. */
async function resolveTieredModel(params) {
	const result = await withSqliteReadOnlyWorkerScope(async () => {
		const providers = params.fallbackProvider && params.fallbackProvider !== params.provider ? [params.provider, params.fallbackProvider] : [params.provider];
		const resolveCandidates = async (options) => {
			const modelOptions = {
				...options,
				abortSignal: params.abortSignal,
				assertCurrent: params.assertCurrent,
				workspaceDir: params.workspaceDir,
				authProfileId: params.authProfileId,
				authProfileMode: params.authProfileMode,
				modelIdSource: params.requestedRouteResolution === "resolved" ? "selected" : "input"
			};
			let firstFailure;
			for (const provider of providers) {
				const resolution = await resolveModelAsync(provider, params.modelId, params.agentDir, params.config, modelOptions);
				if (resolution.model) return {
					provider: resolution.logicalRef.provider,
					resolution
				};
				firstFailure ??= {
					provider,
					resolution
				};
			}
			return firstFailure;
		};
		const firstTier = await resolveCandidates({
			skipAgentDiscovery: true,
			allowBundledStaticCatalogFallback: params.staticCatalogOwnsTransport,
			preferBundledStaticCatalogTransport: params.staticCatalogOwnsTransport,
			preparedModelRuntime: params.preparedModelRuntime
		});
		if (firstTier.resolution.model || params.staticCatalogOwnsTransport) return firstTier;
		const config = params.config ?? {};
		const preparedModelRuntime = params.preparedModelRuntime ?? await prepareModelRuntimeSnapshot({
			config,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		});
		return await resolveCandidates({
			...preparedModelRuntime.createStores(),
			allowBundledStaticCatalogFallback: true,
			preparedModelRuntime
		});
	});
	params.abortSignal?.throwIfAborted();
	params.assertCurrent?.();
	return result;
}
//#endregion
//#region src/agents/embedded-agent-runner/direct-compaction-preparation.ts
async function prepareDirectCompactionAttempt(params) {
	const startedAt = Date.now();
	const diagId = params.diagId?.trim() || createDirectCompactionDiagId();
	const trigger = params.trigger ?? "manual";
	const attempt = params.attempt ?? 1;
	const maxAttempts = params.maxAttempts ?? 1;
	const runId = params.runId ?? params.sessionId;
	const compactionModelCallTrace = freezeDiagnosticTraceContext(getActiveDiagnosticTraceContext() ?? createDiagnosticTraceContext());
	const diagnosticCompactionRunId = `${runId}:compaction:${diagId}`;
	let diagnosticModelCallSeq = 0;
	const resolvedWorkspace = resolveUserPath(params.workspaceDir);
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, sessionAgentId);
	const { runtimePolicySessionKey, runtimePolicyAgentId, boundHarnessRuntime, selectedHarnessRuntimeOverride, runtimeModelAuth: { plan: reusableRuntimeAuthPlan, authProfileId, modelAuth: initialModelAuth }, provider, runtimeProvider, contextConfigProvider, modelId } = resolveCompactionRuntimeSelection({
		...params,
		modelId: params.model,
		boundHarnessRuntime: params.agentHarnessId,
		preparedRuntimePlan: params.runtimePlan
	});
	await ensureSelectedAgentHarnessPlugin({
		config: params.config,
		provider,
		modelId,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentHarnessId: boundHarnessRuntime,
		agentHarnessRuntimeOverride: selectedHarnessRuntimeOverride,
		workspaceDir: resolvedWorkspace,
		pluginRegistry: params.preparedModelRuntime.pluginRegistry
	});
	const attemptedThinking = /* @__PURE__ */ new Set();
	const fail = (reason, err) => {
		const failureReason = classifyCompactionReason(reason);
		const failure = err ? describeFailoverError(err) : void 0;
		const detail = failureReason === "unknown" ? formatUnknownCompactionReasonDetail(reason) : void 0;
		const detailSuffix = detail ? ` detail=${detail}` : "";
		log.warn(`[compaction-diag] end runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} outcome=failed reason=${failureReason}${detailSuffix} durationMs=${Date.now() - startedAt}`);
		return {
			ok: false,
			compacted: false,
			reason,
			failure: failure ? {
				reason: failure.reason,
				status: failure.status,
				code: failure.code,
				rawError: failure.rawError ?? failure.message
			} : void 0
		};
	};
	const preparedModelRuntime = params.preparedModelRuntime;
	const { resolution: modelResolution } = await resolveTieredModel({
		abortSignal: params.abortSignal,
		provider: runtimeProvider,
		modelId,
		requestedRouteResolution: params.requestedRouteResolution,
		agentDir,
		config: params.config,
		workspaceDir: resolvedWorkspace,
		...initialModelAuth,
		preparedModelRuntime
	});
	const { model, error, authStorage, modelRegistry } = modelResolution;
	if (!model) return {
		ok: false,
		result: fail(error ?? `Unknown model: ${runtimeProvider}/${modelId}`)
	};
	const harnessAuth = await prepareCompactionHarnessAuth({
		...params,
		provider,
		metadataProvider: runtimeProvider,
		modelId,
		model,
		reusableRuntimeAuthPlan,
		agentDir,
		workspaceDir: resolvedWorkspace,
		authProfileId,
		runtimePolicyAgentId,
		runtimePolicySessionKey,
		agentHarnessId: boundHarnessRuntime,
		agentHarnessRuntimeOverride: selectedHarnessRuntimeOverride
	});
	if (!harnessAuth.ok) {
		params.abortSignal?.throwIfAborted();
		return {
			ok: false,
			result: fail(formatErrorMessage(harnessAuth.error), harnessAuth.error)
		};
	}
	const { runtimeAuthProfileStore, runtimeAuthPreparation, selectedPreparedHarness, providerUsesProfileScopedModelMetadata } = harnessAuth;
	const preparedHarnessRuntime = selectedPreparedHarness.id;
	let resolvedAuthAttempt;
	try {
		resolvedAuthAttempt = await resolvePreparedRuntimeAuthAttempts({
			attempts: runtimeAuthPreparation.attempts,
			store: runtimeAuthProfileStore,
			modelId,
			model,
			materializeModel: async (materializeParams) => await materializePreparedRuntimeModel({
				...materializeParams,
				provider,
				modelId,
				config: params.config,
				workspaceDir: resolvedWorkspace,
				metadataSnapshot: preparedModelRuntime.metadataSnapshot,
				resolveModel: ({ config, authProfileId: profileId, authProfileMode }) => resolveModelAsync(runtimeProvider, modelId, agentDir, config, {
					abortSignal: params.abortSignal,
					authStorage,
					modelRegistry,
					preparedModelRuntime,
					workspaceDir: resolvedWorkspace,
					modelIdSource: params.requestedRouteResolution === "resolved" ? "selected" : "input",
					skipAgentDiscovery: true,
					allowBundledStaticCatalogFallback: true,
					authProfileId: profileId,
					authProfileMode
				})
			}) ?? materializeParams.model,
			forceCredentialScopedDirectModelResolve: providerUsesProfileScopedModelMetadata,
			resolveAuth: async ({ attempt: preparedAttempt, model: attemptModel }) => await resolvePreparedRuntimeModelAuth({
				plan: preparedAttempt.plan,
				model: attemptModel,
				cfg: params.config,
				store: runtimeAuthProfileStore,
				agentDir,
				workspaceDir: resolvedWorkspace,
				...preparedAttempt.allowAuthProfileFallback !== void 0 ? { allowAuthProfileFallback: preparedAttempt.allowAuthProfileFallback } : {},
				secretSentinels: true
			}),
			errorMessage: `Prepared compaction auth attempts could not be resolved for ${provider}/${modelId}.`
		});
		params.abortSignal?.throwIfAborted();
	} catch (err) {
		return {
			ok: false,
			result: fail(formatErrorMessage(err), err)
		};
	}
	let runtimeModel = resolvedAuthAttempt.model;
	const apiKeyInfo = resolvedAuthAttempt.auth;
	const resolvedRuntimeAuthPlan = resolvedAuthAttempt.plan;
	let hasRuntimeAuthExchange = false;
	try {
		if (!apiKeyInfo.apiKey) {
			if (apiKeyInfo.mode !== "aws-sdk") throw new MissingProviderAuthError(runtimeModel.provider, apiKeyInfo);
		} else {
			const runtimeAuth = await prepareProviderRuntimeAuth({
				provider: runtimeModel.provider,
				config: params.config,
				workspaceDir: resolvedWorkspace,
				env: process.env,
				context: {
					config: params.config,
					agentDir,
					workspaceDir: resolvedWorkspace,
					env: process.env,
					provider: runtimeModel.provider,
					modelId,
					model: runtimeModel,
					apiKey: unwrapSecretSentinelsForProviderEgress(apiKeyInfo.apiKey, "provider runtime auth exchange"),
					authMode: apiKeyInfo.mode,
					profileId: apiKeyInfo.profileId
				}
			});
			params.abortSignal?.throwIfAborted();
			const preparedAuth = protectPreparedProviderRuntimeAuth({
				provider: runtimeModel.provider,
				preparedAuth: runtimeAuth
			});
			runtimeModel = applyPreparedRuntimeAuthToModel(runtimeModel, preparedAuth);
			const runtimeApiKey = preparedAuth?.apiKey ?? apiKeyInfo.apiKey;
			hasRuntimeAuthExchange = Boolean(preparedAuth?.apiKey);
			if (!runtimeApiKey) throw new Error(`Provider "${runtimeModel.provider}" runtime auth returned no apiKey.`);
			authStorage.setRuntimeApiKey(runtimeModel.provider, runtimeApiKey);
		}
	} catch (err) {
		return {
			ok: false,
			result: fail(formatErrorMessage(err), err)
		};
	}
	const thinkingCompat = projectModelThinkingCompat(runtimeModel.compat);
	const thinkingCatalogEntry = {
		provider: runtimeModel.provider,
		id: runtimeModel.id,
		api: runtimeModel.api,
		reasoning: runtimeModel.reasoning,
		...runtimeModel.thinkingLevelMap ? { thinkingLevelMap: runtimeModel.thinkingLevelMap } : {},
		params: runtimeModel.params,
		...thinkingCompat ? { compat: thinkingCompat } : {}
	};
	const thinkLevel = resolveEmbeddedCompactionThinkingLevel({
		config: params.config,
		provider: runtimeModel.provider,
		modelId: runtimeModel.id,
		inheritedLevel: params.thinkLevel,
		compactionThinkingDefault: runtimeModel.compactionThinkingDefault,
		catalog: [thinkingCatalogEntry],
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentRuntime: preparedHarnessRuntime
	});
	await fs.mkdir(resolvedWorkspace, { recursive: true });
	const sessionKey = params.sessionKey?.trim() || params.sessionId;
	const sandboxSessionKey = params.sandboxSessionKey?.trim() || sessionKey;
	const sandboxAgentId = params.sandboxAgentId ?? (sandboxSessionKey === sessionKey ? sessionAgentId : void 0);
	const sandbox = params.sandbox === void 0 ? await resolveSandboxContext({
		config: params.config,
		agentId: sandboxAgentId,
		execOverrides: params.execOverrides,
		sessionKey: sandboxSessionKey,
		workspaceDir: resolvedWorkspace
	}) : params.sandbox;
	if (params.requireWritableSandbox && sandbox?.enabled && sandbox.workspaceAccess !== "rw") throw new Error("sandbox workspace is not read-write; collection review skipped");
	const effectiveWorkspace = sandbox?.enabled ? sandbox.workspaceAccess === "rw" ? resolvedWorkspace : sandbox.workspaceDir : resolvedWorkspace;
	const requestedCwd = params.cwd ? resolveUserPath(params.cwd) : void 0;
	if (sandbox?.enabled && requestedCwd && requestedCwd !== resolvedWorkspace) throw new Error("cwd override is not supported for sandboxed embedded compaction runs; omit cwd or use the agent workspace as cwd");
	const effectiveCwd = sandbox?.enabled ? effectiveWorkspace : requestedCwd ?? effectiveWorkspace;
	await fs.mkdir(effectiveWorkspace, { recursive: true });
	return {
		ok: true,
		value: {
			params,
			diagId,
			trigger,
			attempt,
			maxAttempts,
			runId,
			compactionModelCallTrace,
			diagnosticCompactionRunId,
			nextDiagnosticModelCallId: () => `${diagnosticCompactionRunId}:model:${diagnosticModelCallSeq += 1}`,
			agentDir,
			provider,
			contextConfigProvider,
			modelId,
			preparedHarnessRuntime,
			thinkLevel,
			attemptedThinking,
			fail,
			authStorage,
			modelRegistry,
			runtimeModel,
			apiKeyInfo,
			resolvedRuntimeAuthPlan,
			hasRuntimeAuthExchange,
			resolvedWorkspace,
			sandboxSessionKey,
			sandboxAgentId,
			sandbox,
			effectiveWorkspace,
			effectiveCwd,
			sessionAgentId
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/prepared-compaction-runtime.ts
async function buildPreparedCompactionRuntime(prepared, onCleanupReady) {
	const { params, runId, agentDir, provider, contextConfigProvider, modelId, preparedHarnessRuntime, thinkLevel, runtimeModel, apiKeyInfo, resolvedRuntimeAuthPlan, hasRuntimeAuthExchange, resolvedWorkspace, sandboxSessionKey, sandboxAgentId, sandbox, effectiveWorkspace, effectiveCwd, sessionAgentId } = prepared;
	const mode = params.execOverrides?.mode ? SESSION_PERMISSION_BY_EXEC_MODE[params.execOverrides.mode] : params.permissionMode ?? params.sessionEntry?.permissionMode;
	const root = params.sessionRoot ?? params.sessionEntry?.sessionRoot;
	const sessionPermissionPolicy = mode ? {
		mode,
		root: root ?? await fs.realpath(resolvedWorkspace)
	} : void 0;
	const execOverrides = sessionPermissionPolicy ? {
		...params.execOverrides,
		mode: resolveSessionPermissionExecMode(sessionPermissionPolicy)
	} : params.execOverrides;
	let restoreSkillEnv;
	let bundleMcpRuntime;
	let bundleLspRuntime;
	let toolRuntimesDisposed = false;
	let skillEnvironmentRestored = false;
	const disposeToolRuntimes = async () => {
		if (toolRuntimesDisposed) return;
		toolRuntimesDisposed = true;
		for (const runtime of [bundleMcpRuntime, bundleLspRuntime]) try {
			await runtime?.dispose();
		} catch {}
	};
	const restoreSkillEnvironment = () => {
		if (skillEnvironmentRestored) return;
		skillEnvironmentRestored = true;
		restoreSkillEnv?.();
	};
	onCleanupReady({
		disposeToolRuntimes,
		restoreSkillEnvironment
	});
	try {
		const preparedSkills = await prepareEmbeddedSkills({
			assertCurrent: () => params.abortSignal?.throwIfAborted(),
			attempt: {
				config: params.config,
				bootstrapWorkspaceDir: params.bootstrapWorkspaceDir,
				skillsSnapshot: params.skillsSnapshot
			},
			effectiveWorkspace,
			sandbox,
			sessionAgentId,
			includeCodeModeSkills: false
		});
		restoreSkillEnv = preparedSkills.restoreSkillEnv;
		const { skillsSnapshotForRun, skillReadResources, skillUsagePaths, skillsPrompt } = preparedSkills;
		const sessionLabel = params.sessionKey ?? params.sessionId;
		const resolvedMessageProvider = params.messageChannel ?? params.messageProvider;
		const { bootstrapFiles, contextFiles } = resolveContextInjectionMode(params.config, sessionAgentId) === "never" ? {
			bootstrapFiles: [],
			contextFiles: []
		} : await resolveBootstrapContextForRun({
			workspaceDir: effectiveWorkspace,
			config: params.config,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			chatType: params.chatType,
			agentId: sessionAgentId,
			warn: makeBootstrapWarn({
				sessionLabel,
				warn: (message) => log.warn(message)
			})
		});
		const bootstrapInjectionStats = buildBootstrapInjectionStats({
			bootstrapFiles,
			injectedFiles: contextFiles
		});
		const bootstrapBudget = buildBootstrapBudgetState({
			config: params.config,
			agentId: sessionAgentId,
			files: bootstrapInjectionStats
		});
		const bootstrapTruncationNotice = buildBootstrapPromptWarningNotice(bootstrapBudget.bootstrapPromptWarning.lines);
		const contextTokenBudget = resolveCompactionContextTokenBudget({
			config: params.config,
			provider: contextConfigProvider,
			modelId,
			model: runtimeModel,
			requestedTokenBudget: params.contextTokenBudget,
			fallbackTokenBudget: params.tokenBudget
		});
		const modelWithAuth = applyAuthHeaderOverride(applyLocalNoAuthHeaderOverride(contextTokenBudget < (runtimeModel.contextWindow ?? Infinity) ? {
			...runtimeModel,
			contextWindow: contextTokenBudget
		} : runtimeModel, apiKeyInfo), hasRuntimeAuthExchange ? null : apiKeyInfo, params.config);
		const providerRuntimeHandle = resolvePreparedProviderRuntimeHandle({
			provider,
			modelId,
			config: params.config,
			workspaceDir: effectiveWorkspace,
			providerRuntimeHandle: params.runtimePlan?.providerRuntimeHandle,
			metadataSnapshot: params.preparedModelRuntime.metadataSnapshot
		});
		const effectiveModel = attachModelProviderRuntimePluginHandle(modelWithAuth, providerRuntimeHandle);
		const reuseFullRuntimePlan = params.runtimePlan?.auth === resolvedRuntimeAuthPlan;
		const preparedRuntimePlan = (reuseFullRuntimePlan ? params.runtimePlan : void 0) ?? buildAgentRuntimePlan({
			provider,
			modelId,
			model: effectiveModel,
			modelApi: effectiveModel.api,
			providerRuntimeHandle,
			harnessId: preparedHarnessRuntime,
			harnessRuntime: preparedHarnessRuntime,
			authProfileMode: resolvedRuntimeAuthPlan.selectedAuthMode,
			sessionAuthProfileId: resolvedRuntimeAuthPlan.forwardedAuthProfileId,
			sessionAuthProfileSource: resolvedRuntimeAuthPlan.forwardedAuthProfileSource,
			sessionAuthProfileCandidateIds: resolvedRuntimeAuthPlan.forwardedAuthProfileCandidateIds,
			modelRoute: resolvedRuntimeAuthPlan.modelRoute,
			config: params.config,
			workspaceDir: effectiveWorkspace,
			agentDir,
			agentId: sessionAgentId,
			thinkingLevel: mapThinkingLevelForProvider(thinkLevel, effectiveModel)
		});
		const runtimePlan = reuseFullRuntimePlan ? preparedRuntimePlan : {
			...preparedRuntimePlan,
			auth: resolvedRuntimeAuthPlan
		};
		const runAbortController = new AbortController();
		const spawnWorkspaceDir = effectiveCwd !== effectiveWorkspace ? resolvedWorkspace : resolveAttemptSpawnWorkspaceDir({
			sandbox,
			resolvedWorkspace
		});
		const conversationContext = {
			config: params.config,
			sessionKey: sandboxSessionKey,
			runSessionKey: params.sessionKey?.trim() || params.sessionId,
			sessionId: params.sessionId,
			runId: params.runId,
			agentDir,
			agentAccountId: params.agentAccountId,
			messageProvider: resolvedMessageProvider,
			chatType: params.chatType,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			modelProvider: effectiveModel.provider,
			modelId,
			modelApi: effectiveModel.api,
			modelContextWindowTokens: contextTokenBudget,
			workspaceDir: effectiveWorkspace,
			cwd: effectiveCwd,
			spawnWorkspaceDir,
			skillsSnapshot: skillsSnapshotForRun
		};
		const runtimeCapabilityProfile = resolveConversationCapabilityProfile({
			...conversationContext,
			agentId: sandboxAgentId,
			conversationToolPolicy: params.conversationToolPolicy,
			senderIsOwner: params.senderIsOwner,
			sandboxToolPolicy: sandbox?.tools,
			inputProvenance: params.inputProvenance,
			trustedInternalHandoff: params.trustedInternalHandoff,
			pluginMetadataSnapshot: params.preparedModelRuntime.metadataSnapshot
		});
		const toolsEnabled = supportsModelTools(effectiveModel);
		const skillInstructionDeliveryCache = createSkillInstructionDeliveryCache();
		const toolsRaw = toolsEnabled ? createOpenClawCodingToolsInternal({
			...conversationContext,
			agentId: sessionAgentId,
			exec: {
				...execOverrides,
				config: params.config,
				elevated: params.bashElevated
			},
			sandbox,
			sessionPermissionPolicy,
			requireWorkspaceOnly: params.requireWorkspaceOnly,
			clientCaps: params.clientCaps,
			pinnedWidgetAuthoring: params.pinnedWidgetAuthoring,
			oneShotCliRun: params.oneShotCliRun,
			allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
			webSearchEnabled: params.toolOverrides?.webSearch !== false,
			abortSignal: runAbortController.signal,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			modelHasVision: effectiveModel.input?.includes("image") ?? false,
			modelCompat: extractModelCompat(effectiveModel),
			skillUsagePaths,
			skillInstructionDeliveryCache,
			conversationCapabilityProfile: runtimeCapabilityProfile,
			preparedModelRuntime: params.preparedModelRuntime,
			modelAuthMode: resolveModelAuthMode(effectiveModel.provider, params.config, void 0, { workspaceDir: effectiveWorkspace })
		}, skillReadResources) : [];
		const runtimePlanModelContext = {
			workspaceDir: effectiveWorkspace,
			modelApi: effectiveModel.api,
			model: effectiveModel
		};
		const toolDiagnosticContext = {
			runId,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		};
		const normalizableToolProjection = filterProviderNormalizableTools(toolsRaw);
		await logRuntimeToolSchemaQuarantine({
			...toolDiagnosticContext,
			diagnostics: normalizableToolProjection.diagnostics,
			tools: toolsRaw
		});
		const tools = runtimePlan.tools.normalize([...normalizableToolProjection.tools], runtimePlanModelContext);
		bundleMcpRuntime = toolsEnabled ? await createBundleMcpToolRuntime({
			workspaceDir: effectiveWorkspace,
			cfg: params.config,
			reservedToolNames: tools.map((tool) => tool.name)
		}) : void 0;
		bundleLspRuntime = toolsEnabled ? await createBundleLspToolRuntime({
			workspaceDir: effectiveWorkspace,
			cfg: params.config,
			abortSignal: params.abortSignal,
			reservedToolNames: [...tools.map((tool) => tool.name), ...bundleMcpRuntime?.tools.map((tool) => tool.name) ?? []]
		}) : void 0;
		const filteredBundledTools = applyFinalEffectiveToolPolicy({
			bundledTools: [...bundleMcpRuntime?.tools ?? [], ...bundleLspRuntime?.tools ?? []],
			config: params.config,
			conversationCapabilityProfile: runtimeCapabilityProfile,
			warn: (message) => log.warn(message)
		});
		const normalizableBundledToolProjection = filterProviderNormalizableTools(filteredBundledTools);
		if (normalizableBundledToolProjection.diagnostics.length > 0) await logRuntimeToolSchemaQuarantine({
			...toolDiagnosticContext,
			diagnostics: normalizableBundledToolProjection.diagnostics,
			tools: filteredBundledTools
		});
		const normalizedBundledTools = filteredBundledTools.length > 0 ? runtimePlan.tools.normalize([...normalizableBundledToolProjection.tools], runtimePlanModelContext) : filteredBundledTools;
		const projectedEffectiveTools = [...tools, ...normalizedBundledTools];
		const toolSchemaProjection = filterRuntimeCompatibleTools(projectedEffectiveTools);
		await logRuntimeToolSchemaQuarantine({
			...toolDiagnosticContext,
			diagnostics: toolSchemaProjection.diagnostics,
			tools: projectedEffectiveTools
		});
		const effectiveTools = [...toolSchemaProjection.tools];
		const allowedToolNames = collectAllowedToolNames({ tools: effectiveTools });
		const promptPolicyRestricted = toolPolicyRestrictsTools({ allow: params.toolsAllow });
		const promptTools = applyEmbeddedAttemptToolsAllow(effectiveTools, params.toolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
		const promptAllowedToolNames = collectAllowedToolNames({ tools: promptTools });
		runtimePlan.tools.logDiagnostics(effectiveTools, runtimePlanModelContext);
		const machineName = await getMachineDisplayName();
		const runtimeChannel = normalizeMessageChannel(params.messageChannel ?? params.messageProvider);
		const runtimeCapabilities = collectRuntimeChannelCapabilities({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		});
		const reactionGuidance = runtimeChannel && params.config ? resolveChannelReactionGuidance({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		}) : void 0;
		const messageToolHints = runtimeChannel ? resolveChannelMessageToolHints({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		}) : void 0;
		const runtimeInfo = {
			agentId: sessionAgentId,
			agentName: params.config ? resolveRuntimeAgentName(params.config, sessionAgentId) : void 0,
			sessionKey: params.sessionKey,
			host: machineName,
			os: resolveRuntimeOsLabel(),
			arch: os.arch(),
			node: process.version,
			model: `${provider}/${modelId}`,
			shell: detectRuntimeShell(),
			channel: runtimeChannel,
			chatType: params.chatType,
			capabilities: runtimeCapabilities,
			activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				agentId: sessionAgentId
			}) })
		};
		if (sandbox?.enabled) params.abortSignal?.throwIfAborted();
		const sandboxInfoExecPolicy = sandbox?.enabled && params.bashElevated?.enabled === true ? await resolveEmbeddedSandboxInfoExecPolicy({
			config: params.config,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			permissionMode: sessionPermissionPolicy?.mode,
			sandboxAvailable: sandbox.enabled,
			execOverrides
		}, { signal: params.abortSignal }) : void 0;
		const sandboxInfo = buildEmbeddedSandboxInfo(sandbox, params.bashElevated, sandboxInfoExecPolicy);
		const reasoningTagHint = isReasoningTagProvider(provider, {
			config: params.config,
			workspaceDir: effectiveWorkspace,
			env: process.env,
			modelId,
			modelApi: effectiveModel.api,
			model: effectiveModel
		});
		const userTimezone = resolveUserTimezone(params.config?.agents?.defaults?.userTimezone);
		const userDate = formatDateStamp(Date.now(), userTimezone);
		const promptSurface = resolveAgentPromptSurfaceForSessionKey(params.sessionKey);
		const promptMode = promptPolicyRestricted ? "minimal" : resolvePromptModeForSession(params.sessionKey);
		const nativeCommandGuidanceLines = listRegisteredPluginAgentPromptGuidance({ surface: promptSurface });
		const openClawReferences = await resolveOpenClawReferencePaths({
			workspaceDir: effectiveWorkspace,
			argv1: process.argv[1],
			cwd: effectiveCwd,
			moduleUrl: import.meta.url
		});
		const buildPromptContributionContext = () => ({
			config: params.config,
			agentDir,
			workspaceDir: effectiveWorkspace,
			provider,
			modelId,
			promptMode,
			runtimeChannel,
			runtimeCapabilities,
			agentId: sessionAgentId
		});
		const promptContribution = runtimePlan.prompt.resolveSystemPromptContribution(buildPromptContributionContext());
		const preparedMemoryPrompt = await prepareAgentMemoryPrompt({
			enabled: promptMode === "full",
			toolNames: promptTools.map((tool) => tool.name),
			citationsMode: params.config?.memory?.citations,
			agentId: runtimeInfo.agentId,
			agentSessionKey: runtimeInfo.sessionKey,
			sandboxed: sandboxInfo?.enabled === true
		});
		const preparedWatchedSessions = await prepareWatchedSessionsPromptAsync({
			enabled: promptMode === "full",
			config: params.config,
			sessionKey: params.sessionKey,
			sandboxed: sandboxInfo?.enabled === true,
			toolNames: promptTools.map((tool) => tool.name),
			capabilityToolNames: promptAllowedToolNames,
			assertCurrent: () => params.abortSignal?.throwIfAborted()
		});
		const activeProjectKeys = params.preparedModelRuntime?.activeProjectKeys ?? [];
		const buildSystemPromptText = () => {
			const builtSystemPrompt = buildEmbeddedSystemPrompt({
				config: params.config,
				preparedModelRuntime: params.preparedModelRuntime,
				agentId: sessionAgentId,
				workspaceDir: effectiveWorkspace,
				runtimeCwd: effectiveCwd,
				reasoningLevel: params.reasoningLevel ?? "off",
				extraSystemPrompt: params.extraSystemPrompt,
				ownerNumbers: params.ownerNumbers,
				reasoningTagHint,
				skillsPrompt: promptPolicyRestricted ? void 0 : skillsPrompt,
				docsPath: openClawReferences.docsPath ?? void 0,
				sourcePath: openClawReferences.sourcePath ?? void 0,
				promptMode,
				promptSurface,
				sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
				acpEnabled: isAcpRuntimeSpawnAvailable({
					config: params.config,
					sandboxed: sandboxInfo?.enabled === true
				}),
				runtimeInfo,
				reactionGuidance,
				messageToolHints,
				sandboxInfo,
				tools: promptTools,
				userTimezone,
				userDate,
				contextFiles,
				bootstrapTruncationNotice,
				activeProjectKeys,
				preparedMemoryPrompt,
				preparedWatchedSessions,
				promptContribution,
				nativeCommandGuidanceLines
			});
			return transformProviderSystemPrompt({
				provider,
				config: params.config,
				workspaceDir: effectiveWorkspace,
				context: {
					...buildPromptContributionContext(),
					systemPrompt: builtSystemPrompt
				}
			});
		};
		return {
			...prepared,
			contextTokenBudget,
			effectiveModel,
			runtimePlan,
			runtimePlanModelContext,
			runAbortController,
			effectiveTools,
			allowedToolNames,
			buildSystemPromptText,
			resolvedMessageProvider
		};
	} catch (err) {
		restoreSkillEnvironment();
		throw err;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/direct-compaction.ts
async function compactEmbeddedAgentSessionDirectOnce(params) {
	const callerResult = createDeferredCore();
	const trackOwner = captureAsyncWorkTracker();
	const parentSignal = getAsyncWorkSignal();
	const cancellationSignal = params.abortSignal && parentSignal ? AbortSignal.any([params.abortSignal, parentSignal]) : params.abortSignal ?? parentSignal;
	const work = new AsyncWorkScope();
	const context = work.run(() => AsyncLocalStorage.snapshot());
	const cleanupWork = new AsyncWorkScope();
	const cleanupContext = cleanupWork.run(() => AsyncLocalStorage.snapshot());
	let cleanup;
	const runAttempt = async () => {
		const preparation = await prepareDirectCompactionAttempt({
			...params,
			abortSignal: work.signal
		});
		if (!preparation.ok) return preparation.result;
		try {
			return await executePreparedCompactionSession(await buildPreparedCompactionRuntime(preparation.value, (preparedCleanup) => {
				cleanup = preparedCleanup;
			}));
		} catch (err) {
			if (hasModelFallbackStop(err)) throw err;
			return preparation.value.fail(formatErrorMessage(err), err);
		} finally {
			cleanup?.restoreSkillEnvironment();
		}
	};
	trackOwner(async () => {
		const closeWork = () => {
			context(() => work.beginClose(cancellationSignal?.reason));
			cleanupContext(() => cleanupWork.beginClose(cancellationSignal?.reason));
		};
		cancellationSignal?.addEventListener("abort", closeWork, { once: true });
		if (cancellationSignal?.aborted) closeWork();
		try {
			callerResult.resolve(await work.track(runAttempt));
		} catch (error) {
			callerResult.reject(error);
		} finally {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => context(() => work.beginClose()));
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => cleanupWork.track(() => cleanupContext(() => cleanup?.disposeToolRuntimes())));
			} finally {
				try {
					await AsyncWorkScope.runWhenAllIdle(() => [work, cleanupWork], () => cleanupContext(() => cleanupWork.beginClose()));
					await AsyncWorkScope.runWhenAllIdle(() => [work, cleanupWork], () => Promise.all([context(() => work.drain()), cleanupContext(() => cleanupWork.drain())]));
				} finally {
					cancellationSignal?.removeEventListener("abort", closeWork);
				}
			}
		}
	}).catch(callerResult.reject);
	return await callerResult.promise;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/prepared-runtime-context.ts
/**
* Selects the plugin-generation workspace for a run that executes outside it. Rooted runs borrow
* their canonical bootstrap workspace. A Gateway projects one immutable boot inventory for every
* run workspace, so its configured agent generation already owns the same plugins; building a
* replacement would only cold-load that inventory again on the main thread.
*/
function resolveSharedPluginRuntimeWorkspace(params, pluginMetadataSnapshot) {
	const rooted = resolveRootedRunRuntimeWorkspace(params);
	if (rooted || params.isCanonicalWorkspace) return rooted;
	return isCurrentPluginMetadataSnapshotRuntimeGeneration(pluginMetadataSnapshot()) ? resolveCanonicalRunRuntimeWorkspace(params) : void 0;
}
/** Selects plugin-generation facts independently from a run's execution boundary. */
function resolvePreparedRuntimeWorkspaces(params) {
	const requestedWorkspaceResolution = resolveRunWorkspaceDir(params);
	const workspaceParams = {
		...params,
		workspaceDir: requestedWorkspaceResolution.workspaceDir,
		isCanonicalWorkspace: requestedWorkspaceResolution.isCanonicalWorkspace
	};
	const sharedRuntimeWorkspace = params.pluginGeneration ? resolveRootedRunRuntimeWorkspace(workspaceParams) : resolveSharedPluginRuntimeWorkspace(workspaceParams, () => loadPluginMetadataSnapshot({
		config: params.config ?? {},
		workspaceDir: requestedWorkspaceResolution.workspaceDir,
		env: process.env
	}));
	return {
		requestedWorkspaceResolution,
		runtimeWorkspaceResolution: sharedRuntimeWorkspace ?? requestedWorkspaceResolution,
		preserveExecutionWorkspace: sharedRuntimeWorkspace !== void 0
	};
}
/** Rebinds every config-derived run projection to one committed prepared generation. */
function bindRunToPreparedModelRuntime(params) {
	const preparedAgentId = params.preparedModelRuntime.agentId ?? params.requestedWorkspaceResolution.agentId;
	const workspaceResolution = {
		...params.requestedWorkspaceResolution,
		agentId: preparedAgentId,
		workspaceDir: params.preserveExecutionWorkspace ? params.requestedWorkspaceResolution.workspaceDir : params.preparedModelRuntime.workspaceDir ?? params.requestedWorkspaceResolution.workspaceDir
	};
	return {
		runParams: {
			...params.runParams,
			agentId: preparedAgentId,
			agentDir: params.preparedModelRuntime.agentDir,
			config: params.preparedModelRuntime.config,
			workspaceDir: workspaceResolution.workspaceDir
		},
		workspaceResolution
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/compact.ts
function lockedHarnessCompactionFailure(runtime) {
	return {
		ok: false,
		compacted: false,
		reason: `Model selection is locked to native agent harness "${runtime}"; generic compaction is unavailable.`,
		failure: { reason: "model_selection_locked" }
	};
}
async function compactNativeCliSession(params) {
	const runtime = normalizeOptionalAgentRuntimeId(params.runtime);
	if (!runtime || params.compactParams.trigger !== "manual") return;
	const backend = resolveCliBackendConfig(runtime, params.compactParams.config, { agentId: params.compactParams.agentId });
	if (!backend?.ownsNativeCompaction) return;
	const manualCompaction = backend.manualCompaction;
	if (!manualCompaction) return {
		ok: false,
		compacted: false,
		reason: `CLI backend "${runtime}" owns compaction but does not support manual compaction.`
	};
	const cliSessionBinding = params.compactParams.cliSessionBinding;
	const cliSessionId = (cliSessionBinding?.sessionId ?? params.compactParams.cliSessionId)?.trim();
	if (!cliSessionId) return {
		ok: false,
		compacted: false,
		reason: `CLI backend "${runtime}" cannot manually compact without a resumable native session.`
	};
	const { runCliAgent } = await import("./cli-runner-_QYlTjim.mjs");
	const runId = `${params.compactParams.runId ?? params.compactParams.sessionId}:native-compact`;
	const sessionAgentId = resolveSessionAgentIds({
		sessionKey: params.compactParams.sessionKey,
		config: params.compactParams.config,
		agentId: params.compactParams.agentId
	}).sessionAgentId;
	const preparedRunAdmission = prepareSystemAgentRunAdmission(params.compactParams.config ?? {}, runId, sessionAgentId, "agents.native-compaction");
	try {
		const runControlOperation = async () => {
			await runCliAgent({
				preparedRunAdmission,
				sessionId: params.compactParams.sessionId,
				sessionKey: params.compactParams.sessionKey,
				sessionFile: params.compactParams.sessionFile,
				agentId: params.compactParams.agentId,
				workspaceDir: params.compactParams.workspaceDir,
				cwd: params.compactParams.cwd,
				agentDir: params.compactParams.agentDir,
				config: params.compactParams.config,
				prompt: manualCompaction.buildPrompt(params.compactParams.customInstructions),
				provider: runtime,
				modelProvider: params.compactParams.provider,
				model: params.compactParams.model,
				thinkLevel: params.compactParams.thinkLevel,
				timeoutMs: resolveCompactionTimeoutMs(params.compactParams.config),
				runId,
				cliSessionId,
				...cliSessionBinding ? { cliSessionBinding } : {},
				...cliSessionBinding?.authProfileId ? { authProfileId: cliSessionBinding.authProfileId } : params.compactParams.authProfileId ? { authProfileId: params.compactParams.authProfileId } : {},
				...params.compactParams.sessionEntry ? { sessionEntry: params.compactParams.sessionEntry } : {},
				contextWindow: params.compactParams.sessionEntry?.contextWindow,
				trigger: "manual",
				controlOperation: "compact",
				disableCliLiveSession: true,
				cleanupCliLiveSessionOnRunEnd: true,
				allowEmptyAssistantReplyAsSilent: true,
				abortSignal: params.compactParams.abortSignal
			});
		};
		if (params.runControlOperation) await params.runControlOperation(runControlOperation);
		else await runControlOperation();
	} catch (err) {
		const signal = params.compactParams.abortSignal;
		if (signal?.aborted && (isAbortError(err) || err === signal.reason)) throw err;
		return {
			ok: false,
			compacted: false,
			reason: `CLI backend "${runtime}" failed to compact its native session: ${formatErrorMessage(err)}`
		};
	} finally {
		preparedRunAdmission.close();
	}
	return {
		ok: true,
		compacted: true,
		reason: `CLI backend "${runtime}" compacted its native session.`
	};
}
function resolveCompactionFallbacksOverride(params) {
	if (params.modelSelectionLocked) return [];
	return params.modelFallbacksOverride ?? resolveRunModelFallbacksOverride({
		cfg: params.config,
		sessionKey: params.sessionKey
	});
}
function classifyCompactionFallbackResult(result, provider, model) {
	if (result.ok) return null;
	const reason = result.reason?.trim();
	if (!reason) return null;
	const failureError = Object.assign(new Error(result.failure?.rawError ?? reason), {
		status: result.failure?.status,
		code: result.failure?.code
	});
	const failoverError = coerceToFailoverError(failureError, {
		provider,
		model
	});
	return failoverError ? { error: failoverError } : null;
}
/**
* Core compaction logic without lane queueing.
* Use this when already inside a session/global lane to avoid deadlocks.
*/
async function compactEmbeddedAgentSessionDirect(paramsInput) {
	const paramsBase = applyAgentRunSessionTargetIdentity(paramsInput);
	const memoryTranscript = readCompactionAccountingRecorder(paramsBase.contextEngineRuntimeContext)?.memoryTranscript;
	memoryTranscript?.assertActive();
	const runSessionTarget = memoryTranscript?.sessionTarget ?? await resolveAgentRunSessionTarget({
		...paramsBase,
		missingSessionKey: "resolve-existing"
	});
	const entry = loadSessionEntryReadOnly({
		...runSessionTarget,
		readConsistency: "latest"
	});
	const lockedHarnessRuntime = resolveSessionPinnedHarnessId(entry);
	const transcriptBytePreflightClaim = consumeTranscriptBytePreflightClaim(paramsBase, runSessionTarget, lockedHarnessRuntime);
	const transcriptBytePreflightAuthority = transcriptBytePreflightClaim?.authority;
	const requestedParams = {
		...paramsBase,
		config: projectCodexHostTranscriptBytePreflightConfig(paramsBase.config, Boolean(transcriptBytePreflightAuthority)),
		sessionEntry: entry ? projectPublicSessionEntry(entry) : void 0,
		agentHarnessId: lockedHarnessRuntime ?? paramsBase.agentHarnessId,
		modelSelectionLocked: entry?.modelSelectionLocked ?? paramsBase.modelSelectionLocked,
		agentId: runSessionTarget.agentId,
		sessionId: runSessionTarget.sessionId,
		sessionKey: runSessionTarget.sessionKey,
		sessionTarget: {
			agentId: runSessionTarget.agentId,
			sessionId: runSessionTarget.sessionId,
			sessionKey: runSessionTarget.sessionKey,
			storePath: runSessionTarget.storePath,
			...paramsBase.sessionTarget?.threadId !== void 0 ? { threadId: paramsBase.sessionTarget.threadId } : {}
		},
		sessionFile: runSessionTarget.sessionKey
	};
	const requestedAgentIds = resolveSessionAgentIds({
		sessionKey: requestedParams.sessionKey,
		config: requestedParams.config,
		agentId: requestedParams.agentId
	});
	const requestedAgentDir = requestedParams.agentDir ?? resolveAgentDir(requestedParams.config ?? {}, requestedAgentIds.sessionAgentId);
	const requestedWorkspaceDir = resolveUserPath(requestedParams.workspaceDir);
	const canonicalWorkspaceDir = resolveUserPath(resolveAgentWorkspaceDir(requestedParams.config ?? {}, requestedAgentIds.sessionAgentId));
	const nativeCliResult = await compactNativeCliSession({
		runtime: resolveCompactionRuntimeSelection({
			...requestedParams,
			modelId: requestedParams.model,
			boundHarnessRuntime: requestedParams.agentHarnessId,
			preparedRuntimePlan: requestedParams.runtimePlan
		}).selectedHarnessRuntime,
		compactParams: {
			...requestedParams,
			agentDir: requestedAgentDir,
			workspaceDir: requestedWorkspaceDir
		}
	});
	if (nativeCliResult) return nativeCliResult;
	if (lockedHarnessRuntime && lockedHarnessRuntime !== "openclaw" && !transcriptBytePreflightAuthority) return lockedHarnessCompactionFailure(lockedHarnessRuntime);
	const sharedRuntimeWorkspace = resolveSharedPluginRuntimeWorkspace({
		...requestedParams,
		workspaceDir: requestedWorkspaceDir,
		agentId: requestedAgentIds.sessionAgentId,
		isCanonicalWorkspace: requestedWorkspaceDir === canonicalWorkspaceDir
	}, () => loadPluginMetadataSnapshot({
		config: requestedParams.config ?? {},
		workspaceDir: requestedWorkspaceDir,
		env: process.env
	}));
	const callerResult = createDeferredCore();
	const trackOwner = captureAsyncWorkTracker();
	const parentSignal = getAsyncWorkSignal();
	const cancellationSignal = requestedParams.abortSignal && parentSignal ? AbortSignal.any([requestedParams.abortSignal, parentSignal]) : requestedParams.abortSignal ?? parentSignal;
	const work = new AsyncWorkScope();
	let context = work.run(() => AsyncLocalStorage.snapshot());
	let releasePreparedRuntime;
	const runPreparedCompaction = async () => {
		const preparedModelRuntimeLease = await runOutsidePluginRuntimeGenerationScope(() => acquireAgentRunPreparedModelRuntime({
			config: requestedParams.config ?? {},
			agentId: requestedAgentIds.sessionAgentId,
			agentDir: requestedAgentDir,
			workspaceDir: sharedRuntimeWorkspace?.workspaceDir ?? requestedWorkspaceDir,
			preserveWorkspaceDirOnRefresh: !sharedRuntimeWorkspace && requestedWorkspaceDir !== canonicalWorkspaceDir,
			...requestedParams.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
		}, {
			abortSignal: requestedParams.abortSignal,
			deriveRuntimePluginSelections: ({ config: admittedConfig, metadataSnapshot }) => {
				const config = projectCodexHostTranscriptBytePreflightConfig(admittedConfig, Boolean(transcriptBytePreflightAuthority));
				const selected = resolveCompactionRuntimeSelection({
					...requestedParams,
					config,
					modelId: requestedParams.model,
					boundHarnessRuntime: requestedParams.agentHarnessId,
					preparedRuntimePlan: requestedParams.runtimePlan,
					manifestPlugins: metadataSnapshot,
					allowPluginNormalization: false
				});
				const pluginPlanCandidates = resolveModelCandidateChain({
					cfg: config,
					agentId: requestedAgentIds.sessionAgentId,
					manifestPlugins: metadataSnapshot,
					allowPluginNormalization: false,
					provider: selected.provider,
					model: selected.modelId,
					requestedRouteResolution: "resolved",
					fallbacksOverride: transcriptBytePreflightAuthority ? [] : resolveCompactionFallbacksOverride({
						...requestedParams,
						config
					})
				});
				return [{
					provider: selected.provider,
					modelId: selected.modelId,
					...selected.selectedHarnessRuntime ? { runtime: selected.selectedHarnessRuntime } : {},
					agentId: requestedAgentIds.sessionAgentId
				}, ...pluginPlanCandidates.filter((candidate) => candidate.provider !== selected.provider || candidate.model !== selected.modelId).map((candidate) => ({
					provider: candidate.provider,
					modelId: candidate.model,
					runtime: selected.boundHarnessRuntime,
					agentId: requestedAgentIds.sessionAgentId
				}))];
			}
		}));
		releasePreparedRuntime = () => preparedModelRuntimeLease[Symbol.asyncDispose]();
		try {
			const preparedModelRuntimeOwnerSnapshot = preparedModelRuntimeLease.snapshot;
			const preparedConfig = projectCodexHostTranscriptBytePreflightConfig(preparedModelRuntimeOwnerSnapshot.config, Boolean(transcriptBytePreflightAuthority)) ?? preparedModelRuntimeOwnerSnapshot.config;
			const preparedWorkspaceDir = sharedRuntimeWorkspace ? requestedWorkspaceDir : preparedModelRuntimeOwnerSnapshot.workspaceDir ?? requestedWorkspaceDir;
			const repoRoot = resolveSystemPromptRepoRoot({
				config: preparedConfig,
				workspaceDir: preparedWorkspaceDir,
				cwd: requestedParams.cwd
			}) ?? null;
			const projectKey = repoRoot ? await resolveProjectKey(repoRoot) : null;
			const activeProjectKeys = prepareEmbeddedSessionActiveProjectKeys(requestedParams.sessionId, projectKey);
			const preparedModelRuntime = Object.freeze({
				...preparedModelRuntimeOwnerSnapshot,
				config: preparedConfig,
				repoRoot,
				projectKey,
				activeProjectKeys
			});
			const params = {
				...requestedParams,
				config: preparedConfig,
				agentId: preparedModelRuntime.agentId ?? requestedAgentIds.sessionAgentId,
				agentDir: preparedModelRuntime.agentDir,
				workspaceDir: preparedWorkspaceDir,
				preparedModelRuntime,
				...transcriptBytePreflightClaim ? {
					transcriptBytePreflightAuthority: true,
					...transcriptBytePreflightClaim.withCompactionPersistenceAsync ? { transcriptByteCompactionPersistenceAsync: transcriptBytePreflightClaim.withCompactionPersistenceAsync } : {},
					...transcriptBytePreflightClaim.withCompactionPersistence ? { transcriptByteCompactionPersistence: transcriptBytePreflightClaim.withCompactionPersistence } : {}
				} : {}
			};
			const compactPrepared = async () => {
				if (transcriptBytePreflightAuthority || params.config?.agents?.defaults?.compaction?.model?.trim() || (resolveCompactionFallbacksOverride(params) ?? resolveAgentModelFallbackValues(params.config?.agents?.defaults?.model)).length === 0) return await compactEmbeddedAgentSessionDirectOnce(params);
				const resolvedCompactionTarget = resolveEmbeddedCompactionTarget({
					config: params.config,
					provider: params.provider,
					modelId: params.model,
					authProfileId: params.authProfileId,
					modelSelectionLocked: params.modelSelectionLocked,
					defaultProvider: DEFAULT_PROVIDER,
					defaultModel: DEFAULT_MODEL
				});
				const primaryProvider = resolvedCompactionTarget.provider ?? "openai";
				const primaryModel = resolvedCompactionTarget.model ?? "gpt-6-astra";
				const requestedPrimaryProvider = params.provider?.trim() || "openai";
				const resolveAuthProvider = (provider) => resolveProviderIdForAuth(provider, {
					config: params.config,
					metadataSnapshot: preparedModelRuntime.metadataSnapshot
				});
				const primaryAuthProviders = new Set([primaryProvider, requestedPrimaryProvider].map(resolveAuthProvider));
				const fallbacksOverride = resolveCompactionFallbacksOverride(params);
				const fallbackAgentId = resolveSessionAgentIds({
					sessionKey: params.sandboxSessionKey ?? params.sessionKey,
					config: params.config,
					agentId: params.sandboxAgentId ?? params.agentId
				}).sessionAgentId;
				const resolvedPrimaryCandidate = resolveModelCandidateChain({
					cfg: params.config,
					agentId: fallbackAgentId,
					manifestPlugins: preparedModelRuntime.metadataSnapshot,
					provider: primaryProvider,
					model: primaryModel,
					requestedRouteResolution: "resolved",
					fallbacksOverride
				})[0];
				const fallbackSessionKey = params.sandboxSessionKey ?? params.sessionKey ?? params.sessionId;
				return (await runWithModelFallback({
					cfg: params.config,
					manifestPlugins: preparedModelRuntime.metadataSnapshot,
					provider: primaryProvider,
					model: primaryModel,
					requestedRouteResolution: "resolved",
					runId: params.runId ?? params.sessionId,
					agentDir: params.agentDir,
					agentId: fallbackAgentId,
					sessionId: params.sessionId,
					sessionKey: fallbackSessionKey,
					userLockedAuthProfileId: params.authProfileIdSource === "user" ? params.authProfileId : void 0,
					abortSignal: params.abortSignal,
					prepareAgentHarnessRuntime: async ({ provider, model, agentHarnessRuntimeOverride }) => {
						await ensureSelectedAgentHarnessPlugin({
							config: params.config,
							provider,
							modelId: model,
							agentId: fallbackAgentId,
							sessionKey: fallbackSessionKey,
							agentHarnessRuntimeOverride,
							workspaceDir: params.workspaceDir,
							pluginRegistry: preparedModelRuntime.pluginRegistry
						});
					},
					fallbacksOverride,
					classifyResult: ({ result, provider, model }) => classifyCompactionFallbackResult(result, provider, model),
					run: async (provider, model) => {
						const isPrimaryCandidate = provider === resolvedPrimaryCandidate?.provider && model === resolvedPrimaryCandidate.model;
						const preservesPrimaryAuth = isPrimaryCandidate || primaryAuthProviders.has(resolveAuthProvider(provider));
						const authProfileId = preservesPrimaryAuth ? params.authProfileId : void 0;
						return await compactEmbeddedAgentSessionDirectOnce({
							...params,
							provider,
							model,
							requestedRouteResolution: isPrimaryCandidate ? void 0 : "resolved",
							authProfileId,
							authProfileIdSource: preservesPrimaryAuth ? params.authProfileIdSource : void 0,
							runtimeAuthPlan: isPrimaryCandidate ? params.runtimeAuthPlan : void 0,
							runtimePlan: isPrimaryCandidate ? params.runtimePlan : void 0
						});
					}
				})).result;
			};
			return await withPluginRuntimeGenerationScope(preparedModelRuntime, () => {
				context = AsyncLocalStorage.snapshot();
				return compactPrepared();
			});
		} catch (err) {
			return {
				ok: false,
				compacted: false,
				reason: isFallbackSummaryError(err) ? err.message : formatErrorMessage(err)
			};
		}
	};
	trackOwner(async () => {
		const closeWork = () => context(() => work.beginClose(cancellationSignal?.reason));
		cancellationSignal?.addEventListener("abort", closeWork, { once: true });
		if (cancellationSignal?.aborted) closeWork();
		try {
			callerResult.resolve(await work.track(runPreparedCompaction));
		} catch (error) {
			callerResult.reject(error);
		} finally {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => context(() => work.drain()));
			} finally {
				try {
					await releasePreparedRuntime?.();
				} finally {
					cancellationSignal?.removeEventListener("abort", closeWork);
				}
			}
		}
	}).catch(callerResult.reject);
	return await callerResult.promise;
}
//#endregion
export { resolveTieredModel as a, resolveCompactionRuntimeSelection as c, setTranscriptBytePreflightClaim as d, attachCompactionAccountingRecorder as f, resolvePreparedRuntimeWorkspaces as i, resolveProjectKey as l, compactNativeCliSession as n, prepareCompactionHarnessAuth as o, runPostCompactionSideEffects as p, bindRunToPreparedModelRuntime as r, projectCodexHostTranscriptBytePreflightConfig as s, compactEmbeddedAgentSessionDirect as t, resolveTranscriptBytePreflightAuthority as u };
