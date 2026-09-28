import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "../../agent-scope-config-IQKOEtZ4.mjs";
import { l as normalizePluginsConfig } from "../../config-state-BEAL5gWH.mjs";
import { a as getMemoryCapabilityRegistration } from "../../memory-state-CGjwGUK0.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { n as resolveLivePluginConfigObject } from "../../plugin-config-runtime-CaI6yWBc.mjs";
import "../../agent-runtime-vMVS3kbD.mjs";
import "../../memory-host-core-DP3Ksyf2.mjs";
import { L as MAX_SETUP_GRACE_TIMEOUT_MS, M as HOOK_TIMEOUT_RECOVERY_GRACE_MS, R as MAX_TIMEOUT_MS, l as ACTIVE_MEMORY_STATUS_PREFIX } from "../../types-DgEaE0BK.mjs";
import { c as resetActiveMemoryConfigForTests, d as setMinimumTimeoutMsForTests, f as setSetupGraceTimeoutMsForTests, i as isMissingRegisteredMemoryToolsError, o as normalizePluginConfig, r as hasDeprecatedModelFallbackPolicy, s as readActiveMemoryConfig, t as applyCliRuntimeRecallTimeoutDefault } from "../../config-BxNoMMde.mjs";
import { n as resolveRecallEscalationDecision } from "../../escalation-B0r0wGN-.mjs";
import { n as buildSearchQuery, o as getModelRef, r as extractRecentTurns, t as buildQuery } from "../../query-OBXHW90K.mjs";
import { n as buildPromptPrefix, r as buildRecallOutcomePrefix } from "../../prompt-CxzFbTjp.mjs";
import { c as resetActiveRecallStateForTests, f as setCachedResult, i as getCachedResult, m as toSingleLineErrorMessage, n as buildCircuitBreakerKey, o as isCircuitBreakerOpen, r as forgetActiveRecallRun, t as buildCacheKey } from "../../recall-state-Y1cKVKa7.mjs";
import { i as resolveCanonicalSessionKeyFromSessionId, o as resolveStatusUpdateAgentId, r as persistPluginStatusLines } from "../../session-DKG1YEAF.mjs";
import { o as hasUsableMemoryResultInSessionRecord, t as createActiveMemoryHookDeadline } from "../../transcript-B36Eu2pe.mjs";
import { a as readPartialAssistantText, c as resetActiveMemoryTranscriptForTests, l as setTimeoutPartialDataGraceMsForTests } from "../../transcript-result-CXjUFcY_.mjs";
import { t as maybeResolveActiveRecall } from "../../recall-CzcB-VsR.mjs";
import { a as isAllowedChatId, c as isEnabledForAgent, d as lacksAdminToMutateActiveMemoryGlobal, f as resolveCommandSessionKey, g as updateActiveMemoryGlobalEnabledInConfig, h as shouldSkipActiveMemoryForHarnessSession, i as isActiveMemoryPluginEnabled, l as isPrivateRecallDestination, m as shouldRememberAcrossConversations, n as formatActiveMemoryCommandHelp, o as isAllowedChatType, p as setSessionActiveMemoryDisabled, r as isActiveMemoryGloballyEnabled, s as isEligibleInteractiveSession, t as ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT, u as isSessionActiveMemoryDisabled } from "../../session-policy-CEH5DExD.mjs";
import { a as resetTriggerRecallRunsForTests, o as resolveTriggerRecall, r as forgetTriggerRecallRun } from "../../trigger-recall-Bc7J6Lka.mjs";
//#region extensions/active-memory/index.ts
var active_memory_default = definePluginEntry({
	id: "active-memory",
	name: "Active Memory",
	description: "Proactively surfaces relevant memory before eligible conversational replies.",
	register(api) {
		const readCurrentConfig = () => readActiveMemoryConfig(api);
		let config = normalizePluginConfig(api.pluginConfig, readCurrentConfig());
		const warnDeprecatedModelFallbackPolicy = (pluginConfig) => {
			if (hasDeprecatedModelFallbackPolicy(pluginConfig)) api.logger.warn?.("active-memory: config.modelFallbackPolicy is deprecated and no longer changes runtime behavior. config.modelFallback is a chain-resolution last-resort (consulted only when config.model, the current run's model, and the agent's configured default all resolve to nothing) — it is NOT a runtime failover that substitutes a different model when the resolved model errors out.");
		};
		warnDeprecatedModelFallbackPolicy(api.pluginConfig);
		const refreshLiveConfigFromRuntime = () => {
			const livePluginConfig = resolveLivePluginConfigObject(api.runtime.config?.current ? () => api.runtime.config.current() : void 0, "active-memory", api.pluginConfig);
			const liveConfig = readCurrentConfig();
			const effectivePluginConfig = !isActiveMemoryPluginEnabled(liveConfig) ? { enabled: false } : livePluginConfig ?? {};
			config = normalizePluginConfig(effectivePluginConfig, liveConfig);
			if (livePluginConfig) warnDeprecatedModelFallbackPolicy(livePluginConfig);
		};
		api.registerCommand({
			name: "active-memory",
			description: "Enable, disable, or inspect Active Memory for this session.",
			acceptsArgs: true,
			exposeSenderIsOwner: true,
			handler: async (ctx) => {
				const tokens = ctx.args?.trim().split(/\s+/).filter(Boolean) ?? [];
				const isGlobal = tokens.includes("--global");
				const action = (tokens.find((token) => token !== "--global") ?? "status").toLowerCase();
				if (action === "help") return { text: formatActiveMemoryCommandHelp() };
				const enabled = [
					"on",
					"enable",
					"enabled"
				].includes(action) ? true : [
					"off",
					"disable",
					"disabled"
				].includes(action) ? false : void 0;
				refreshLiveConfigFromRuntime();
				if (isGlobal) {
					const currentConfig = api.runtime.config.current();
					if (action === "status") return { text: `Active Memory: ${isActiveMemoryGloballyEnabled(currentConfig) ? "on" : "off"} globally.` };
					if (lacksAdminToMutateActiveMemoryGlobal({
						senderIsOwner: ctx.senderIsOwner,
						gatewayClientScopes: ctx.gatewayClientScopes
					})) return { text: ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT };
					if (enabled !== void 0) {
						await api.runtime.config.mutateConfigFile({
							afterWrite: { mode: "auto" },
							writeOptions: { assertCurrent: Array.isArray(ctx.gatewayClientScopes) ? void 0 : ctx.assertOwnerCurrent },
							mutate: (draft) => {
								const nextConfig = updateActiveMemoryGlobalEnabledInConfig(draft, enabled);
								Object.assign(draft, nextConfig);
							}
						});
						refreshLiveConfigFromRuntime();
						return { text: `Active Memory: ${enabled ? "on" : "off"} globally.` };
					}
				}
				const sessionKey = resolveCommandSessionKey({
					api,
					config,
					sessionKey: ctx.sessionKey,
					sessionId: ctx.sessionId
				});
				if (!sessionKey) return { text: "Active Memory: session toggle unavailable because this command has no session context." };
				const commandAgentId = resolveStatusUpdateAgentId({ sessionKey });
				const liveConfig = readCurrentConfig();
				if (!(isEnabledForAgent(config, commandAgentId) || config.enabled && shouldRememberAcrossConversations(liveConfig, commandAgentId))) return { text: "Active Memory: off for this session." };
				if (action === "status") return { text: `Active Memory: ${await isSessionActiveMemoryDisabled({
					api,
					sessionKey
				}) ? "off" : "on"} for this session.` };
				if (enabled !== void 0) {
					await setSessionActiveMemoryDisabled({
						api,
						sessionKey,
						disabled: !enabled
					});
					if (!enabled) await persistPluginStatusLines({
						api,
						agentId: commandAgentId,
						sessionKey
					});
					return { text: `Active Memory: ${enabled ? "on" : "off"} for this session.` };
				}
				return { text: `Unknown Active Memory action: ${action}\n\n${formatActiveMemoryCommandHelp()}` };
			}
		});
		const beforePromptBuildTimeoutMs = MAX_TIMEOUT_MS + MAX_SETUP_GRACE_TIMEOUT_MS + HOOK_TIMEOUT_RECOVERY_GRACE_MS * 2;
		const logRecallSkipped = (reason) => {
			api.logger.info?.(`active-memory: recall skipped reason=${reason}`);
		};
		api.on("before_prompt_build", async (event, ctx) => {
			const toolAuthority = ctx.toolAuthority;
			if (!toolAuthority) {
				api.logger.debug?.("active-memory: recall skipped because this prompt has no turn tool authority");
				return;
			}
			toolAuthority.assertActive();
			refreshLiveConfigFromRuntime();
			const liveConfig = readCurrentConfig();
			const timeoutAgentId = resolveStatusUpdateAgentId(ctx);
			const timeoutModelRef = (timeoutAgentId ? getModelRef(liveConfig, timeoutAgentId, config, {
				modelProviderId: ctx.modelProviderId,
				modelId: ctx.modelId
			}) : {
				provider: ctx.modelProviderId,
				model: ctx.modelId
			}) ?? {};
			const cliDispatchEligibility = api.runtime.agent.resolveCliBackendDispatchEligibility({
				provider: timeoutModelRef.provider,
				model: timeoutModelRef.model,
				config: liveConfig,
				...timeoutAgentId ? {
					agentId: timeoutAgentId,
					agentDir: resolveAgentDir(liveConfig, timeoutAgentId),
					workspaceDir: resolveAgentWorkspaceDir(liveConfig, timeoutAgentId)
				} : {}
			});
			const invocationConfig = applyCliRuntimeRecallTimeoutDefault(config, cliDispatchEligibility !== void 0);
			const authorityAllowedRecallTools = invocationConfig.toolsAllow.filter((toolName) => toolAuthority.allows(toolName));
			const liveRecallTimeoutMs = invocationConfig.timeoutMs + invocationConfig.setupGraceTimeoutMs + HOOK_TIMEOUT_RECOVERY_GRACE_MS;
			const deadlineController = new AbortController();
			const hookDeadline = createActiveMemoryHookDeadline();
			const armHookDeadline = (timeoutMs, phase) => {
				hookDeadline.arm(timeoutMs, () => {
					deadlineController.abort(/* @__PURE__ */ new Error(`active-memory ${phase} timeout after ${timeoutMs}ms`));
					api.logger.warn?.(`active-memory: before_prompt_build ${phase} timed out after ${String(timeoutMs)}ms; skipping memory lookup`);
				});
			};
			armHookDeadline(HOOK_TIMEOUT_RECOVERY_GRACE_MS, "preflight");
			const handlerPromise = (async () => {
				try {
					const resolvedAgentId = resolveStatusUpdateAgentId(ctx);
					const resolvedSessionKey = ctx.sessionKey?.trim() || (resolvedAgentId ? resolveCanonicalSessionKeyFromSessionId({
						api,
						agentId: resolvedAgentId,
						sessionId: ctx.sessionId
					}) : void 0);
					const effectiveAgentId = resolvedAgentId || resolveStatusUpdateAgentId({ sessionKey: resolvedSessionKey });
					if (authorityAllowedRecallTools.length === 0) {
						await persistPluginStatusLines({
							api,
							agentId: effectiveAgentId,
							sessionKey: resolvedSessionKey,
							statusLine: `${ACTIVE_MEMORY_STATUS_PREFIX} status=policy-disabled`
						});
						logRecallSkipped("policy-disabled");
						toolAuthority.assertActive();
						return;
					}
					if (shouldSkipActiveMemoryForHarnessSession({
						api,
						agentId: effectiveAgentId,
						sessionKey: resolvedSessionKey
					})) {
						logRecallSkipped("harness-session");
						return;
					}
					const sessionDisabled = await isSessionActiveMemoryDisabled({
						api,
						sessionKey: resolvedSessionKey
					});
					deadlineController.signal.throwIfAborted();
					toolAuthority.assertActive();
					if (sessionDisabled) {
						logRecallSkipped("session-disabled");
						await persistPluginStatusLines({
							api,
							agentId: effectiveAgentId,
							sessionKey: resolvedSessionKey
						});
						return;
					}
					const sessionContext = {
						...ctx,
						sessionKey: resolvedSessionKey ?? ctx.sessionKey
					};
					if (!isEligibleInteractiveSession(sessionContext)) {
						logRecallSkipped("session-ineligible");
						await persistPluginStatusLines({
							api,
							agentId: effectiveAgentId,
							sessionKey: resolvedSessionKey
						});
						return;
					}
					const destinationContext = {
						...sessionContext,
						mainKey: liveConfig.session?.mainKey ?? api.config.session?.mainKey
					};
					const currentUserMessage = event.currentUserMessage ?? event.prompt;
					if (event.currentUserMessage !== void 0 && !currentUserMessage.trim()) {
						api.logger.debug?.("active-memory: recall skipped reason=no-current-text");
						return;
					}
					const requestKey = event.currentUserMessage === void 0 ? void 0 : event.currentUserMessageId ? JSON.stringify({
						message: currentUserMessage,
						messageId: event.currentUserMessageId
					}) : null;
					const recentTurns = extractRecentTurns(event.messages);
					const searchQuery = buildSearchQuery({
						latestUserMessage: currentUserMessage,
						recentTurns
					});
					const memorySlot = normalizePluginsConfig(liveConfig.plugins).slots.memory;
					const memoryCapabilityRegistration = getMemoryCapabilityRegistration();
					const memoryCapability = memoryCapabilityRegistration && memoryCapabilityRegistration.pluginId === memorySlot ? memoryCapabilityRegistration.capability : void 0;
					const allowedRecallTools = authorityAllowedRecallTools;
					const deterministicRecallToolName = memoryCapability?.deterministicRecallToolName;
					const chatIdAllowed = isAllowedChatId(invocationConfig, {
						sessionKey: destinationContext.sessionKey,
						messageProvider: destinationContext.messageProvider,
						channelId: destinationContext.channelId
					});
					const activeMemoryConfigured = isEnabledForAgent(invocationConfig, effectiveAgentId);
					let laneOne = {
						hasStrongHit: false,
						injectedCount: 0
					};
					if (activeMemoryConfigured && effectiveAgentId && deterministicRecallToolName && allowedRecallTools.includes(deterministicRecallToolName) && isPrivateRecallDestination(destinationContext) && chatIdAllowed) {
						toolAuthority.assertActive();
						const triggerLookupTimeoutMs = hookDeadline.remainingMs() - 50;
						if (triggerLookupTimeoutMs > 0) {
							laneOne = await resolveTriggerRecall({
								cfg: liveConfig,
								agentId: effectiveAgentId,
								query: searchQuery,
								message: currentUserMessage,
								activeProjectKeys: ctx.activeProjectKeys,
								signal: AbortSignal.timeout(triggerLookupTimeoutMs),
								runId: ctx.runId,
								requestKey,
								authorityFingerprint: toolAuthority.fingerprint
							}).catch((error) => {
								api.logger.debug?.(`active-memory: lane-1 trigger recall failed: ${toSingleLineErrorMessage(error)}`);
								return {
									hasStrongHit: false,
									injectedCount: 0
								};
							});
							toolAuthority.assertActive();
							if (laneOne.context && laneOne.injectedCount > 0 && invocationConfig.logging) api.logger.info?.(`active-memory: lane-1 injected ${laneOne.injectedCount} trigger-matched entries`);
						} else api.logger.debug?.("active-memory: lane-1 trigger recall skipped: preflight budget exhausted");
					}
					const laneOneContext = laneOne.context;
					const activeMemoryAllowed = activeMemoryConfigured && isAllowedChatType(invocationConfig, destinationContext) && chatIdAllowed;
					const productRecallRequested = Boolean(invocationConfig.enabled && resolvedSessionKey && shouldRememberAcrossConversations(liveConfig, effectiveAgentId) && isPrivateRecallDestination(destinationContext) && chatIdAllowed);
					const productRecallEligible = productRecallRequested && memoryCapability?.supportsPrivateTranscriptRecall === true;
					if (productRecallRequested && !productRecallEligible) api.logger.warn?.("active-memory: the current memory provider does not support protected private transcript recall; skipping Remember across conversations");
					const productRecallToolName = productRecallEligible && deterministicRecallToolName && allowedRecallTools.includes(deterministicRecallToolName) ? deterministicRecallToolName : void 0;
					const productRecallAllowed = Boolean(productRecallToolName);
					if (productRecallEligible && !productRecallAllowed) api.logger.warn?.(`active-memory: ${deterministicRecallToolName ?? "the provider's deterministic recall tool"} is unavailable; skipping Remember across conversations private transcript recall`);
					if (!activeMemoryAllowed && !productRecallAllowed) {
						logRecallSkipped("destination-not-allowed");
						await persistPluginStatusLines({
							api,
							agentId: effectiveAgentId,
							sessionKey: resolvedSessionKey
						});
						return laneOneContext ? { prependContext: laneOneContext } : void 0;
					}
					const escalationDecision = resolveRecallEscalationDecision({
						mode: invocationConfig.mode,
						message: currentUserMessage,
						hasStrongLaneOneHit: laneOne.hasStrongHit
					});
					if (escalationDecision !== "recall") {
						api.logger.debug?.(`active-memory: recall skipped reason=${escalationDecision}`);
						const prependContext = [laneOneContext, escalationDecision === "no-recall-intent" ? buildRecallOutcomePrefix("skipped-no-recall-intent") : void 0].filter(Boolean).join("\n");
						return prependContext ? { prependContext } : void 0;
					}
					const conversationRecall = productRecallAllowed && resolvedSessionKey ? {
						anchorSessionKey: resolvedSessionKey,
						scope: "same-agent-private",
						corpus: activeMemoryAllowed ? "configured" : "sessions"
					} : void 0;
					const recallConfig = productRecallToolName && !activeMemoryAllowed ? {
						...invocationConfig,
						toolsAllow: [productRecallToolName]
					} : {
						...invocationConfig,
						toolsAllow: allowedRecallTools
					};
					const query = buildQuery({
						latestUserMessage: currentUserMessage,
						recentTurns,
						config: recallConfig
					});
					armHookDeadline(liveRecallTimeoutMs, "recall");
					toolAuthority.assertActive();
					const result = await maybeResolveActiveRecall({
						api,
						runtimeConfig: liveConfig,
						config: recallConfig,
						agentId: effectiveAgentId,
						sessionKey: resolvedSessionKey,
						sessionId: ctx.sessionId,
						messageProvider: ctx.messageProvider,
						channelId: ctx.channelId,
						query,
						requestKey,
						searchQuery,
						currentModelProviderId: ctx.modelProviderId,
						currentModelId: ctx.modelId,
						conversationRecall,
						abortSignal: deadlineController.signal,
						runId: ctx.runId,
						authorityFingerprint: toolAuthority.fingerprint,
						memorySlot: memorySlot ?? void 0,
						activeProjectKeys: ctx.activeProjectKeys
					});
					deadlineController.signal.throwIfAborted();
					toolAuthority.assertActive();
					const prependContext = [laneOneContext, result.summary ? buildPromptPrefix(result.summary) : result.status === "unavailable" ? buildRecallOutcomePrefix(result.status) : void 0].filter(Boolean).join("\n");
					return prependContext ? { prependContext } : void 0;
				} catch (error) {
					if (deadlineController.signal.aborted) return;
					const message = toSingleLineErrorMessage(error);
					api.logger.warn?.(`active-memory: before_prompt_build failed, skipping memory lookup: ${message}`);
					return;
				}
			})();
			try {
				const result = await Promise.race([handlerPromise, hookDeadline.promise]);
				return typeof result === "symbol" ? void 0 : result;
			} finally {
				hookDeadline.stop();
			}
		}, {
			timeoutMs: beforePromptBuildTimeoutMs,
			requiresToolAuthority: true
		});
		api.on("agent_end", (event, ctx) => {
			const runId = event.runId ?? ctx.runId;
			forgetActiveRecallRun(runId);
			forgetTriggerRecallRun(runId);
		});
	}
});
const testing = {
	buildCacheKey,
	buildCircuitBreakerKey,
	getCachedResult,
	hasUsableMemoryResultInSessionRecord,
	isCircuitBreakerOpen,
	isMissingRegisteredMemoryToolsError,
	normalizePluginConfig,
	readPartialAssistantText,
	resetActiveRecallCacheForTests() {
		resetActiveRecallStateForTests();
		resetActiveMemoryConfigForTests();
		resetActiveMemoryTranscriptForTests();
		resetTriggerRecallRunsForTests();
	},
	setMinimumTimeoutMsForTests,
	setSetupGraceTimeoutMsForTests,
	setTimeoutPartialDataGraceMsForTests,
	setCachedResult
};
//#endregion
export { active_memory_default as default, testing };
