import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-10KxeiYV.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as sanitizeForLog } from "./ansi-D1GK_odF.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { m as resolveUserPath } from "./utils-CRO4LGEB.js";
import { l as isSecretRef } from "./types.secrets-OocW4TQ1.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-JZsXee1S.js";
import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { s as normalizePluginsConfig } from "./config-state-CtMlHVRM.js";
import { T as hasSessionAutoModelFallbackProvenance, a as markAutoFallbackPrimaryProbe, h as resolveEffectiveModelFallbacks, i as hasLegacyAutoFallbackWithoutOrigin, m as resolveAutoFallbackPrimaryProbe, n as entryMatchesAutoFallbackPrimaryProbe, t as clearAutoFallbackPrimaryProbeSelection, v as resolveSessionAgentId } from "./agent-scope-B2Pk_xhT.js";
import { a as isSubagentSessionKey } from "./session-key-utils-A-JGvyXu.js";
import { _ as scopeLegacySessionKeyToAgent, c as isUnscopedSessionKeySentinel, p as resolveAgentIdFromSessionKey, s as classifySessionKeyShape, u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { t as resolveEffectiveAgentSkillFilter } from "./agent-filter-z-I3bijt.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-BxAUeF6t.js";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-DK813Vii.js";
import { d as readConfigFileSnapshotForWrite, i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-BMy8GnRz.js";
import { i as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-DXJmS9CT.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-mDjiWzE5.js";
import { n as isThinkingLevelSupported, t as formatThinkingLevels } from "./thinking-BcvxxriC.js";
import { s as normalizeThinkLevel, u as normalizeVerboseLevel } from "./thinking.shared-BWnbgBUO.js";
import { v as setRuntimeConfigSnapshot } from "./runtime-snapshot-DOvWRYVz.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-C77NT24K.js";
import { S as withAgentRunLifecycleGeneration, c as emitAgentEvent, g as registerAgentRunContext, i as clearAgentRunContext, n as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-CRggPZCM.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-3o3tBaCD.js";
import "./message-channel-constants-BXOA4cxJ.js";
import { o as resolveMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-s5PUEeqJ.js";
import "./message-channel-CB9y2CYk.js";
import { C as patchSessionEntry } from "./session-accessor-CwhXEUId.js";
import { n as withPluginRuntimeGatewayRequestScope, t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-CiIBNuZX.js";
import { n as ensureAuthProfileStore } from "./store-9jfx-1KO.js";
import { n as isStoredCredentialCompatibleWithAuthProvider } from "./order-DjOYyPH4.js";
import { _ as resolveConfiguredModelRef, b as resolveModelRefFromString, i as buildModelAliasIndex, r as buildConfiguredModelCatalog } from "./model-selection-shared-DwnYeyqq.js";
import { n as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-EY6njCR-.js";
import { a as normalizeModelRef, i as modelKey, o as normalizeProviderId } from "./model-selection-normalize-Cj03z3tC.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-tUPEe2Ur.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-CFL1kjzt.js";
import { t as loadManifestModelCatalog } from "./model-catalog-CJwDdG-7.js";
import { f as stripInternalRuntimeContext, l as hasInternalRuntimeContext } from "./internal-runtime-context-BW7WOTKc.js";
import { d as ensureAgentWorkspace } from "./workspace-BJm9kqLw.js";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Dv8Iorx2.js";
import { c as resolveAgentRunAbortLifecycleFields, i as createAgentRunRestartAbortError, l as resolveAgentRunErrorLifecycleFields, o as isAgentRunDirectAbortReason, s as isAgentRunRestartAbortReason } from "./run-termination-DjANsN9j.js";
import { n as resolveAgentTimeoutMs } from "./timeout-0Cw4kcol.js";
import { t as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-DRDT9gcW.js";
import { c as resolveSessionWorkStartError } from "./lifecycle-BS_t5emX.js";
import { i as hasNonzeroUsage } from "./usage-BJjt0RVM.js";
import { t as resolveFastModeState } from "./fast-mode-DhLzHuCP.js";
import { n as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-Dg3upVEO.js";
import { n as resolveCandidateThinkingLevel, r as resolveEffectiveAgentRuntime } from "./thinking-runtime-DHKmmAgL.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-CyE-btXR.js";
import { n as resolveSendPolicy } from "./send-policy-dIsJy4mX.js";
import { q as createTrajectoryRuntimeRecorder, r as resolveAvailableAgentHarnessPolicy } from "./selection-Bh0GAnPQ.js";
import { d as formatAgentInternalEventsForPrompt, u as formatAgentInternalEventsForPlainPrompt } from "./subagent-announce-origin-COyWymGb.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-BC4gM9s_.js";
import { r as createUserTurnTranscriptRecorder } from "./user-turn-transcript-x7xWBohS.js";
import { t as buildOutboundSessionContext } from "./session-context-CvL-h647.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-BDpiTJKa.js";
import { o as runWithModelFallback, p as LiveSessionModelSwitchError } from "./model-fallback-DCdP137c.js";
import { n as clearRotatedSessionMetadata, r as resolveSession } from "./session-Dsxk_5KJ.js";
import { d as getScopedChannelsCommandSecretTargets, t as getAgentRuntimeCommandSecretTargetIds } from "./command-secret-targets-D69jAQ1Z.js";
import { n as repairProviderWrappedModelOverride, t as applyModelOverrideToSessionEntry } from "./model-overrides-BfccGJ_e.js";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-vohwTiWf.js";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.js";
import { t as prepareInternalSessionEffectsTranscript } from "./internal-session-effects-BUVpZkck.js";
import { n as normalizeSpawnedRunMetadata } from "./spawned-context-QGy9i1y8.js";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-DiBGJeJJ.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-B7s-CsKk.js";
import "./live-model-switch-D9bQ1xWu.js";
import { r as mergeEmbeddedAgentRunResultForModelFallbackExhaustion, t as classifyEmbeddedAgentRunResultForModelFallback } from "./result-fallback-classifier-CW1CZfdk.js";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-DfdITEs1.js";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-BUp0DZlF.js";
import { t as resolveChannelModelOverride } from "./model-overrides-BqabDnDv.js";
import { r as createChatRunEntry } from "./server-chat-state-_DvSGu8D.js";
import { t as clearSessionAuthProfileOverride } from "./session-override-BXceaoW0.js";
import { r as resolveInlineAgentImageAttachments } from "./agent-turn-attachments-CuKMUA87.js";
import { t as NodeRegistry } from "./node-registry-CZ-JewlC.js";
import { i as resolveAgentOutboundTarget, r as resolveAgentExplicitRecipientSession, t as resolveAgentDeliveryPlan } from "./agent-delivery-BoLIX9Vl.js";
import { n as applyVerboseOverride } from "./level-overrides-DUUBq8xq.js";
import { t as resolveAgentRunContext } from "./run-context-D9olx1SB.js";
//#region src/gateway/local-request-context.ts
function cronUnavailable() {
	throw new Error("Cron is unavailable in local embedded agent gateway context.");
}
const unavailableCron = {
	start: async () => {
		cronUnavailable();
	},
	stop: () => {},
	status: async () => cronUnavailable(),
	list: async () => cronUnavailable(),
	listPage: async () => cronUnavailable(),
	add: async () => cronUnavailable(),
	update: async () => cronUnavailable(),
	updateWithPrecondition: async () => cronUnavailable(),
	remove: async () => cronUnavailable(),
	run: async () => cronUnavailable(),
	enqueueRun: async () => cronUnavailable(),
	getJob: () => void 0,
	readJob: async () => void 0,
	getDefaultAgentId: () => void 0,
	wake: () => ({
		ok: false,
		reason: "unwakeable-session-key"
	})
};
/** Creates the minimal gateway context used by embedded local agent execution. */
function createLocalGatewayRequestContext(params) {
	const logGateway = createSubsystemLogger("gateway/local");
	const sessionEvents = /* @__PURE__ */ new Set();
	const chatRuns = /* @__PURE__ */ new Map();
	const chatRunBuffers = /* @__PURE__ */ new Map();
	const chatDeltaSentAt = /* @__PURE__ */ new Map();
	const chatDeltaLastBroadcastLen = /* @__PURE__ */ new Map();
	const chatDeltaLastBroadcastText = /* @__PURE__ */ new Map();
	const agentDeltaSentAt = /* @__PURE__ */ new Map();
	const bufferedAgentEvents = /* @__PURE__ */ new Map();
	const clearChatRunState = (runId) => {
		chatRunBuffers.delete(runId);
		chatDeltaSentAt.delete(runId);
		chatDeltaLastBroadcastLen.delete(runId);
		chatDeltaLastBroadcastText.delete(runId);
		for (const key of [
			runId,
			`${runId}:assistant`,
			`${runId}:thinking`
		]) {
			agentDeltaSentAt.delete(key);
			bufferedAgentEvents.delete(key);
		}
	};
	return {
		deps: params.deps,
		cron: unavailableCron,
		cronStorePath: "",
		getRuntimeConfig: params.getRuntimeConfig,
		resolveTerminalLaunchPolicy: () => ({
			ok: false,
			block: { kind: "disabled" }
		}),
		isTerminalEnabled: () => false,
		loadGatewayModelCatalog: async () => loadManifestModelCatalog({ config: params.getRuntimeConfig() }),
		getHealthCache: () => null,
		refreshHealthSnapshot: async () => ({}),
		logHealth: { error: (message) => logGateway.error(message) },
		logGateway,
		incrementPresenceVersion: () => 0,
		getHealthVersion: () => 0,
		broadcast: () => {},
		broadcastToConnIds: () => {},
		nodeSendToSession: () => {},
		nodeSendToAllSubscribed: () => {},
		nodeSubscribe: () => {},
		nodeUnsubscribe: () => {},
		nodeUnsubscribeAll: () => {},
		hasConnectedTalkNode: () => false,
		nodeRegistry: new NodeRegistry(),
		agentRunSeq: /* @__PURE__ */ new Map(),
		chatAbortControllers: /* @__PURE__ */ new Map(),
		chatQueuedTurns: /* @__PURE__ */ new Map(),
		chatAbortedRuns: /* @__PURE__ */ new Map(),
		chatRunBuffers,
		chatDeltaSentAt,
		chatDeltaLastBroadcastLen,
		chatDeltaLastBroadcastText,
		agentDeltaSentAt,
		bufferedAgentEvents,
		clearChatRunState,
		addChatRun: (sessionId, entry) => {
			chatRuns.set(sessionId, createChatRunEntry(entry));
		},
		removeChatRun: (sessionId, clientRunId, sessionKey) => {
			const entry = chatRuns.get(sessionId);
			if (!entry || entry.clientRunId !== clientRunId) return;
			if (sessionKey !== void 0 && entry.sessionKey !== sessionKey) return;
			chatRuns.delete(sessionId);
			return entry;
		},
		subscribeSessionEvents: (connId) => {
			sessionEvents.add(connId);
		},
		unsubscribeSessionEvents: (connId) => {
			sessionEvents.delete(connId);
		},
		subscribeSessionMessageEvents: () => {},
		unsubscribeSessionMessageEvents: () => {},
		unsubscribeAllSessionEvents: (connId) => {
			sessionEvents.delete(connId);
		},
		getSessionEventSubscriberConnIds: () => sessionEvents,
		registerToolEventRecipient: () => {},
		dedupe: /* @__PURE__ */ new Map(),
		wizardSessions: /* @__PURE__ */ new Map(),
		crestodianSessions: /* @__PURE__ */ new Map(),
		findRunningWizard: () => null,
		purgeWizardSession: () => {},
		getRuntimeSnapshot: () => ({}),
		startChannel: async () => {
			throw new Error("Channel start is unavailable in local embedded agent gateway context.");
		},
		stopChannel: async () => {
			throw new Error("Channel stop is unavailable in local embedded agent gateway context.");
		},
		markChannelLoggedOut: () => {},
		wizardRunner: async () => {
			throw new Error("Onboarding wizard is unavailable in local embedded agent gateway context.");
		},
		broadcastVoiceWakeChanged: () => {},
		broadcastVoiceWakeRoutingChanged: () => {},
		unavailableGatewayMethods: /* @__PURE__ */ new Set()
	};
}
/** Runs code inside a local gateway request scope unless an outer scope already exists. */
function withLocalGatewayRequestScope(params, run) {
	const existing = getPluginRuntimeGatewayRequestScope();
	if (existing?.context) return run();
	const context = createLocalGatewayRequestContext(params);
	return withPluginRuntimeGatewayRequestScope({
		...existing,
		context,
		isWebchatConnect: existing?.isWebchatConnect ?? (() => false)
	}, run);
}
//#endregion
//#region src/agents/agent-runtime-config.ts
/** Resolves agent runtime config, including SecretRef materialization for agent command use. */
/** Loads runtime/source config and resolves command SecretRefs when the agent path needs them. */
async function resolveAgentRuntimeConfig(runtime, params) {
	const loadedRaw = getRuntimeConfig();
	const includeChannelTargets = params?.runtimeTargetsChannelSecrets === true;
	const channelSecretScope = params?.runtimeChannelSecretScope;
	const hasRuntimeSecretRefs = hasAgentRuntimeSecretRefs({
		config: loadedRaw,
		includeChannelTargets,
		channel: channelSecretScope?.channel
	});
	const sourceConfig = await (async () => {
		try {
			const { snapshot } = await readConfigFileSnapshotForWrite();
			if (snapshot.valid) return snapshot.resolved;
		} catch {}
		return loadedRaw;
	})();
	const cfg = hasRuntimeSecretRefs ? await (async () => {
		const runtimeSecretTargets = resolveAgentRuntimeSecretTargets({
			config: loadedRaw,
			includeChannelTargets,
			channelSecretScope
		});
		return (await (await import("./command-config-resolution.runtime.js")).resolveCommandConfigWithSecrets({
			config: loadedRaw,
			commandName: "agent",
			targetIds: runtimeSecretTargets.targetIds,
			...runtimeSecretTargets.allowedPaths ? { allowedPaths: runtimeSecretTargets.allowedPaths } : {},
			runtime
		})).resolvedConfig;
	})() : loadedRaw;
	setRuntimeConfigSnapshot(cfg, sourceConfig);
	return {
		loadedRaw,
		sourceConfig,
		cfg
	};
}
function hasNestedSecretRef(value) {
	if (isSecretRef(value)) return true;
	if (Array.isArray(value)) return value.some((entry) => hasNestedSecretRef(entry));
	if (!value || typeof value !== "object") return false;
	return Object.values(value).some((entry) => hasNestedSecretRef(entry));
}
function hasAgentRuntimeSecretRefs(params) {
	const { config } = params;
	if (hasNestedSecretRef(config.models?.providers)) return true;
	if (hasNestedSecretRef(config.agents?.defaults?.memorySearch?.remote?.apiKey)) return true;
	if (Array.isArray(config.agents?.list) && config.agents.list.some((agent) => hasNestedSecretRef(agent?.memorySearch?.remote?.apiKey))) return true;
	if (hasNestedSecretRef(config.messages?.tts?.providers)) return true;
	if (hasNestedSecretRef(config.skills?.entries)) return true;
	if (hasNestedSecretRef(config.tools?.web?.search)) return true;
	if (config.plugins?.entries && Object.values(config.plugins.entries).some((entry) => hasNestedSecretRef({
		webSearch: entry?.config?.webSearch,
		webFetch: entry?.config?.webFetch
	}))) return true;
	if (params.includeChannelTargets) return hasNestedSecretRef(config.channels);
	if (!params.channel) return false;
	return hasNestedSecretRef(config.channels?.[params.channel]);
}
function resolveAgentRuntimeSecretTargets(params) {
	const baseTargetIds = getAgentRuntimeCommandSecretTargetIds({ includeChannelTargets: params.includeChannelTargets });
	if (params.includeChannelTargets || !params.channelSecretScope) return { targetIds: baseTargetIds };
	const channelTargets = getScopedChannelsCommandSecretTargets({
		config: params.config,
		channel: params.channelSecretScope.channel,
		accountId: params.channelSecretScope.accountId,
		defaultAccountWhenMissing: true
	});
	const targetIds = new Set(baseTargetIds);
	for (const targetId of channelTargets.targetIds) targetIds.add(targetId);
	if (!channelTargets.allowedPaths) return { targetIds };
	const allowedPaths = new Set(channelTargets.allowedPaths);
	for (const target of discoverConfigSecretTargetsByIds(params.config, baseTargetIds)) allowedPaths.add(target.path);
	return {
		targetIds,
		allowedPaths
	};
}
//#endregion
//#region src/agents/command/attempt-callbacks.ts
/** Creates callbacks that update lifecycle flags for persistence decisions. */
function createAgentAttemptLifecycleCallbacks(state) {
	return {
		onUserMessagePersisted: () => {
			state.currentTurnUserMessagePersisted = true;
		},
		onAgentEvent: (evt) => {
			if (evt.stream !== "lifecycle" || typeof evt.data?.phase !== "string") return;
			if (typeof evt.data.error === "string" && evt.data.error.trim()) state.lifecycleError = evt.data.error;
			if (evt.data.phase === "finishing") {
				state.lifecycleFinishing = true;
				return;
			}
			if (evt.data.phase === "end" || evt.data.phase === "error") state.lifecycleEnded = true;
		}
	};
}
//#endregion
//#region src/agents/command/attempt-execution.shared.ts
/**
* Shared session persistence and prompt-body helpers for agent attempt
* execution paths.
*/
/** Persists one session entry while keeping the caller's in-memory store aligned. */
async function persistSessionEntry$1(params) {
	let rejectedMissingEntry = false;
	const persisted = await patchSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (_entry, context) => {
		if (params.shouldPersist && !params.shouldPersist(context.existingEntry)) {
			rejectedMissingEntry = !context.existingEntry;
			return null;
		}
		if (!context.existingEntry) return params.entry;
		if (context.existingEntry.sessionId !== params.initialEntry.sessionId) return null;
		return mergeSessionSnapshotChanges({
			initial: params.initialEntry,
			next: params.entry,
			current: context.existingEntry
		});
	}, {
		fallbackEntry: params.sessionStore[params.sessionKey] ?? params.entry,
		replaceEntry: true
	});
	if (rejectedMissingEntry) {
		delete params.sessionStore[params.sessionKey];
		return;
	}
	if (persisted) params.sessionStore[params.sessionKey] = persisted;
	else delete params.sessionStore[params.sessionKey];
	return persisted ?? void 0;
}
/** Prepends hidden internal event context unless the body already carries it. */
function prependInternalEventContext(body, events) {
	if (hasInternalRuntimeContext(body)) return body;
	const renderedEvents = formatAgentInternalEventsForPrompt(events);
	if (!renderedEvents) return body;
	return [renderedEvents, body].filter(Boolean).join("\n\n");
}
function resolvePlainInternalEventBody(body, events) {
	const renderedEvents = formatAgentInternalEventsForPlainPrompt(events);
	if (!renderedEvents) return body;
	return [renderedEvents, stripInternalRuntimeContext(body).trim()].filter(Boolean).join("\n\n") || body;
}
/** Resolves the prompt body submitted to ACP runtimes. */
function resolveAcpPromptBody(body, events) {
	return events?.length ? resolvePlainInternalEventBody(body, events) : body;
}
/** Resolves the body stored in transcripts after internal event rendering. */
function resolveInternalEventTranscriptBody(body, events) {
	if (!hasInternalRuntimeContext(body)) return body;
	return resolvePlainInternalEventBody(body, events);
}
//#endregion
//#region src/agents/agent-command.ts
/** Main agent command orchestration for sessions, model selection, delivery, and attempts. */
const log = createSubsystemLogger("agents/agent-command");
function hasExactConfiguredProviderModel(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const model = params.model.trim();
	if (!normalizedProvider || !model) return false;
	for (const [providerId, providerConfig] of Object.entries(params.cfg.models?.providers ?? {})) {
		if (normalizeProviderId(providerId) !== normalizedProvider) continue;
		return (providerConfig.models ?? []).some((entry) => entry.id.trim() === model);
	}
	return false;
}
function hasConfiguredProvider(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	if (!normalizedProvider) return false;
	return Object.keys(params.cfg.models?.providers ?? {}).some((providerId) => normalizeProviderId(providerId) === normalizedProvider);
}
function allowPluginModelNormalizationForRef(params) {
	if (!normalizePluginsConfig(params.cfg.plugins).enabled && hasConfiguredProvider(params)) return false;
	return !hasExactConfiguredProviderModel(params);
}
function normalizeAgentCommandModelRef(cfg, provider, model, modelManifestContext) {
	return normalizeModelRef(provider, model, {
		...modelManifestContext,
		allowPluginNormalization: allowPluginModelNormalizationForRef({
			cfg,
			provider,
			model
		})
	});
}
function normalizeAgentCommandDefaultModelRef(cfg, provider, model, modelManifestContext) {
	const normalizedProvider = normalizeProviderId(provider);
	if (hasConfiguredProvider({
		cfg,
		provider: normalizedProvider
	})) return {
		provider: normalizedProvider,
		model: normalizeConfiguredProviderCatalogModelId(normalizedProvider, model, { manifestPlugins: modelManifestContext.manifestPlugins })
	};
	return normalizeAgentCommandModelRef(cfg, provider, model, modelManifestContext);
}
function parseAgentCommandModelRef(cfg, raw, defaultProvider, modelManifestContext) {
	const parsed = resolveModelRefFromString({
		cfg,
		raw,
		defaultProvider,
		aliasIndex: buildModelAliasIndex({
			cfg,
			defaultProvider,
			...modelManifestContext,
			allowPluginNormalization: false
		}),
		...modelManifestContext,
		allowPluginNormalization: false
	})?.ref;
	return parsed ? normalizeAgentCommandModelRef(cfg, parsed.provider, parsed.model, modelManifestContext) : null;
}
function resolveAgentRunLifecycleEndLogLevel(meta) {
	const outcome = buildAgentRunTerminalOutcome({
		status: meta.stopReason === "timeout" || meta.timeoutPhase ? "timeout" : meta.aborted === true || meta.error || meta.stopReason === "error" ? "error" : "ok",
		error: meta.error,
		stopReason: meta.stopReason,
		livenessState: meta.livenessState,
		timeoutPhase: meta.timeoutPhase,
		providerStarted: meta.providerStarted
	});
	if (!outcome.stopReason || outcome.stopReason === "end_turn") return;
	if (outcome.reason === "completed") return "info";
	return outcome.status === "timeout" ? "warn" : "error";
}
function applyAgentRunAbortMetadata(result, signal) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted !== true) return result;
	return {
		...result,
		meta: {
			...result.meta,
			...abortFields
		}
	};
}
const attemptExecutionRuntimeLoader = createLazyImportLoader(() => import("./attempt-execution.runtime.js"));
const acpManagerRuntimeLoader = createLazyImportLoader(() => import("./acp/control-plane/manager.js"));
const acpPolicyRuntimeLoader = createLazyImportLoader(() => import("./policy-Cp1Qzhsl.js"));
const acpRuntimeErrorsRuntimeLoader = createLazyImportLoader(() => import("./errors-CNVDMniH.js"));
const acpSessionIdentifiersRuntimeLoader = createLazyImportLoader(() => import("./acp-core/runtime/session-identifiers.js"));
const deliveryRuntimeLoader = createLazyImportLoader(() => import("./delivery.runtime.js"));
const sessionStoreRuntimeLoader = createLazyImportLoader(() => import("./session-store.runtime.js"));
const cliCompactionRuntimeLoader = createLazyImportLoader(() => import("./cli-compaction-Dv5WDCqH.js"));
const transcriptResolveRuntimeLoader = createLazyImportLoader(() => import("./transcript-resolve.runtime.js"));
const cliDepsRuntimeLoader = createLazyImportLoader(() => import("./deps-D3PaFtd3.js"));
const execDefaultsRuntimeLoader = createLazyImportLoader(() => import("./exec-defaults-Uj9zMiVI.js"));
const skillsRuntimeLoader = createLazyImportLoader(async () => {
	const [remote, sessionSnapshot] = await Promise.all([import("./remote-BIaR_g-_.js"), import("./session-snapshot-83GmCX5B.js")]);
	return {
		getRemoteSkillEligibility: remote.getRemoteSkillEligibility,
		resolveReusableWorkspaceSkillSnapshot: sessionSnapshot.resolveReusableWorkspaceSkillSnapshot
	};
});
function loadAttemptExecutionRuntime() {
	return attemptExecutionRuntimeLoader.load();
}
function loadAcpManagerRuntime() {
	return acpManagerRuntimeLoader.load();
}
function loadAcpPolicyRuntime() {
	return acpPolicyRuntimeLoader.load();
}
function loadAcpRuntimeErrorsRuntime() {
	return acpRuntimeErrorsRuntimeLoader.load();
}
function loadAcpSessionIdentifiersRuntime() {
	return acpSessionIdentifiersRuntimeLoader.load();
}
function loadDeliveryRuntime() {
	return deliveryRuntimeLoader.load();
}
function loadSessionStoreRuntime() {
	return sessionStoreRuntimeLoader.load();
}
function loadCliCompactionRuntime() {
	return cliCompactionRuntimeLoader.load();
}
function loadTranscriptResolveRuntime() {
	return transcriptResolveRuntimeLoader.load();
}
function loadCliDepsRuntime() {
	return cliDepsRuntimeLoader.load();
}
function loadExecDefaultsRuntime() {
	return execDefaultsRuntimeLoader.load();
}
function loadSkillsRuntime() {
	return skillsRuntimeLoader.load();
}
async function resolveAgentCommandDeps(deps) {
	if (deps) return deps;
	const { createDefaultDeps } = await loadCliDepsRuntime();
	return createDefaultDeps();
}
const OVERRIDE_VALUE_MAX_LENGTH = 256;
async function persistSessionEntry(params) {
	return await persistSessionEntry$1(params);
}
function clearPendingFinalDeliveryFields(entry, updatedAt) {
	return {
		...entry,
		pendingFinalDelivery: void 0,
		pendingFinalDeliveryText: void 0,
		pendingFinalDeliveryCreatedAt: void 0,
		pendingFinalDeliveryLastAttemptAt: void 0,
		pendingFinalDeliveryAttemptCount: void 0,
		pendingFinalDeliveryLastError: void 0,
		pendingFinalDeliveryContext: void 0,
		pendingFinalDeliveryIntentId: void 0,
		updatedAt
	};
}
async function resolveCurrentRunDeliveryContext(params) {
	const { cfg, opts, sessionEntry } = params;
	if (opts.deliver !== true) return;
	const deliveryPlan = resolveAgentDeliveryPlan({
		sessionEntry,
		requestedChannel: opts.replyChannel ?? opts.channel,
		explicitTo: opts.replyTo ?? opts.to,
		explicitThreadId: opts.threadId,
		accountId: opts.replyAccountId ?? opts.accountId,
		wantsDelivery: true,
		turnSourceChannel: opts.runContext?.messageChannel ?? opts.messageChannel,
		turnSourceTo: opts.runContext?.currentChannelId ?? opts.to,
		turnSourceAccountId: opts.runContext?.accountId ?? opts.accountId,
		turnSourceThreadId: opts.runContext?.currentThreadTs ?? opts.threadId
	});
	const explicitChannelHint = normalizeOptionalString(opts.replyChannel ?? opts.channel);
	const explicitThreadId = opts.threadId != null && opts.threadId !== "" ? opts.threadId : void 0;
	let effectivePlan = deliveryPlan;
	if (deliveryPlan.resolvedChannel === "webchat" && !explicitChannelHint) try {
		const selection = await resolveMessageChannelSelection({ cfg });
		effectivePlan = {
			...deliveryPlan,
			resolvedChannel: selection.channel,
			deliveryTargetMode: deliveryPlan.deliveryTargetMode ?? "implicit"
		};
	} catch {
		return;
	}
	if (!isDeliverableMessageChannel(effectivePlan.resolvedChannel)) return;
	const targetMode = opts.deliveryTargetMode ?? effectivePlan.deliveryTargetMode ?? (opts.to ? "explicit" : "implicit");
	const resolvedTo = effectivePlan.resolvedTo ?? resolveAgentOutboundTarget({
		cfg,
		plan: effectivePlan,
		targetMode,
		validateExplicitTarget: false
	}).resolvedTo;
	if (!resolvedTo) return;
	const threadId = targetMode === "explicit" ? explicitThreadId ?? (effectivePlan.baseDelivery.threadIdSource === "explicit" ? effectivePlan.resolvedThreadId : void 0) : effectivePlan.resolvedThreadId;
	return normalizeDeliveryContext({
		channel: effectivePlan.resolvedChannel,
		to: resolvedTo,
		accountId: effectivePlan.resolvedAccountId,
		threadId
	});
}
function shouldPersistCurrentRunSessionCleanup(current, sessionId) {
	return current !== void 0 && current.sessionId === sessionId && current.abortedLastRun !== true;
}
function shouldPersistRestartRecoveryContextClaim(current, sessionId, runId, allowCreate) {
	if (!current) return allowCreate;
	if (!shouldPersistCurrentRunSessionCleanup(current, sessionId)) return false;
	return current.restartRecoveryDeliveryRunId === void 0 || current.restartRecoveryDeliveryRunId === runId;
}
function shouldPersistRestartRecoveryCleanup(current, sessionId, runId) {
	return shouldPersistCurrentRunSessionCleanup(current, sessionId) && current?.restartRecoveryDeliveryRunId === runId;
}
function containsControlCharacters(value) {
	for (const char of value) {
		const code = char.codePointAt(0);
		if (code === void 0) continue;
		if (code <= 31 || code >= 127 && code <= 159) return true;
	}
	return false;
}
function normalizeExplicitOverrideInput(raw, kind) {
	const trimmed = raw.trim();
	const label = kind === "provider" ? "Provider" : "Model";
	if (!trimmed) throw new Error(`${label} override must be non-empty.`);
	if (trimmed.length > OVERRIDE_VALUE_MAX_LENGTH) throw new Error(`${label} override exceeds ${String(OVERRIDE_VALUE_MAX_LENGTH)} characters.`);
	if (containsControlCharacters(trimmed)) throw new Error(`${label} override contains invalid control characters.`);
	return trimmed;
}
function createAgentCommandSessionWorkingCopy(params) {
	const result = {};
	if (params.sessionEntry) result.sessionEntry = { ...params.sessionEntry };
	if (params.sessionStore || params.sessionKey) result.sessionStore = {};
	if (params.sessionKey && result.sessionEntry && result.sessionStore) result.sessionStore[params.sessionKey] = result.sessionEntry;
	return result;
}
function resolveExplicitAgentCommandSessionKey(params) {
	if (isUnscopedSessionKeySentinel(params.rawExplicitSessionKey) && !params.agentIdOverride && !params.shouldScopeDefaultAgentKey) return params.rawExplicitSessionKey;
	return scopeLegacySessionKeyToAgent({
		agentId: params.agentIdOverride ?? (params.shouldScopeDefaultAgentKey ? resolveDefaultAgentId(params.cfg) : void 0),
		sessionKey: params.rawExplicitSessionKey,
		mainKey: params.cfg.session?.mainKey
	});
}
async function prepareAgentCommandExecution(opts, runtime) {
	const isRawModelRun = opts.modelRun === true || opts.promptMode === "none";
	const message = opts.message ?? "";
	if (!message.trim()) throw new Error("Message (--message) is required");
	const rawExplicitSessionKey = opts.sessionKey?.trim();
	const requestedSessionId = opts.sessionId?.trim() || void 0;
	const rawTo = opts.to?.trim();
	const toSessionKey = !rawExplicitSessionKey && !requestedSessionId && classifySessionKeyShape(rawTo) === "agent" ? rawTo : void 0;
	const recipientChannel = resolveMessageChannel(opts.channel);
	const shouldResolveExplicitRecipientSession = Boolean(!rawExplicitSessionKey && !requestedSessionId && !toSessionKey && opts.agentId?.trim() && recipientChannel && isDeliverableMessageChannel(recipientChannel) && rawTo);
	if (!opts.to && !requestedSessionId && !rawExplicitSessionKey && !opts.agentId) throw new Error("Pass --to <E.164>, --session-key, --session-id, or --agent to choose a session");
	const { cfg } = await resolveAgentRuntimeConfig(runtime, {
		runtimeTargetsChannelSecrets: opts.deliver === true,
		runtimeChannelSecretScope: opts.deliver !== true && shouldResolveExplicitRecipientSession && recipientChannel ? {
			channel: recipientChannel,
			accountId: opts.accountId
		} : void 0
	});
	const normalizedSpawned = normalizeSpawnedRunMetadata({
		spawnedBy: opts.spawnedBy,
		groupId: opts.groupId,
		groupChannel: opts.groupChannel,
		groupSpace: opts.groupSpace,
		workspaceDir: opts.workspaceDir
	});
	const agentIdOverrideRaw = opts.agentId?.trim();
	const agentIdOverride = agentIdOverrideRaw ? normalizeAgentId(agentIdOverrideRaw) : void 0;
	if (agentIdOverride) {
		if (!listAgentIds(cfg).includes(agentIdOverride)) throw new Error(`Unknown agent id "${agentIdOverrideRaw}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`);
	}
	const shouldScopeDefaultAgentKey = Boolean(rawExplicitSessionKey && !agentIdOverride && classifySessionKeyShape(rawExplicitSessionKey) === "legacy_or_alias" && !isUnscopedSessionKeySentinel(rawExplicitSessionKey));
	const explicitSessionKey = toSessionKey ?? resolveExplicitAgentCommandSessionKey({
		rawExplicitSessionKey,
		agentIdOverride,
		shouldScopeDefaultAgentKey,
		cfg
	});
	if (explicitSessionKey && classifySessionKeyShape(explicitSessionKey) === "malformed_agent") throw new Error(`Invalid --session-key "${explicitSessionKey}". Agent-prefixed session keys must use agent:<agent-id>:<session-key>.`);
	if (agentIdOverride && explicitSessionKey && classifySessionKeyShape(explicitSessionKey) === "agent") {
		const sessionAgentId = resolveAgentIdFromSessionKey(explicitSessionKey);
		if (sessionAgentId !== agentIdOverride) throw new Error(`Agent id "${agentIdOverrideRaw}" does not match session key agent "${sessionAgentId}".`);
	}
	const agentCfg = cfg.agents?.defaults;
	const verboseOverride = normalizeVerboseLevel(opts.verbose);
	if (opts.verbose && !verboseOverride) throw new Error("Invalid verbose level. Use \"on\", \"full\", or \"off\".");
	const isSubagentLane = (normalizeOptionalString(opts.lane) ?? "") === AGENT_LANE_SUBAGENT;
	const hasExplicitTimeoutOption = opts.timeout !== void 0;
	const timeoutSecondsRaw = hasExplicitTimeoutOption ? parseStrictNonNegativeInteger(opts.timeout) ?? NaN : isSubagentLane ? 0 : void 0;
	if (timeoutSecondsRaw !== void 0 && (Number.isNaN(timeoutSecondsRaw) || timeoutSecondsRaw < 0)) throw new Error("--timeout must be a non-negative integer (seconds; 0 means no timeout)");
	const timeoutMs = resolveAgentTimeoutMs({
		cfg,
		overrideSeconds: timeoutSecondsRaw
	});
	const runTimeoutOverrideMs = hasExplicitTimeoutOption ? timeoutMs : void 0;
	const selectedCommandOpts = toSessionKey ? {
		...opts,
		to: void 0,
		sessionKey: explicitSessionKey
	} : opts;
	const explicitRecipientSession = shouldResolveExplicitRecipientSession && agentIdOverride && recipientChannel && rawTo ? await resolveAgentExplicitRecipientSession({
		cfg,
		agentId: agentIdOverride,
		channel: recipientChannel,
		to: rawTo,
		accountId: selectedCommandOpts.accountId,
		threadId: selectedCommandOpts.threadId
	}) : void 0;
	if (explicitRecipientSession?.error) throw explicitRecipientSession.error;
	const commandOpts = explicitRecipientSession?.sessionKey ? {
		...selectedCommandOpts,
		channel: explicitRecipientSession.channel,
		to: explicitRecipientSession.to,
		accountId: explicitRecipientSession.accountId,
		threadId: explicitRecipientSession.threadId
	} : selectedCommandOpts;
	const sessionResolution = resolveSession({
		cfg,
		to: commandOpts.to,
		sessionId: commandOpts.sessionId,
		sessionKey: explicitSessionKey ?? explicitRecipientSession?.sessionKey,
		agentId: agentIdOverride,
		clone: false
	});
	const { sessionId, sessionKey, storePath, isNewSession, persistedThinking, persistedVerbose } = sessionResolution;
	const { sessionEntry: sessionEntryRaw, sessionStore } = createAgentCommandSessionWorkingCopy({
		sessionKey,
		sessionEntry: sessionResolution.sessionEntry,
		sessionStore: sessionResolution.sessionStore
	});
	const sessionAgentId = agentIdOverride ?? resolveSessionAgentId({
		sessionKey: sessionKey ?? explicitSessionKey,
		config: cfg
	});
	const outboundSession = buildOutboundSessionContext({
		cfg,
		agentId: sessionAgentId,
		sessionKey
	});
	const workspaceDirRaw = normalizedSpawned.workspaceDir ?? resolveAgentWorkspaceDir(cfg, sessionAgentId);
	const workspaceDir = resolveUserPath(workspaceDirRaw);
	const cwd = normalizeOptionalString(opts.cwd) ?? normalizeOptionalString(sessionEntryRaw?.spawnedCwd);
	const agentDir = resolveAgentDir(cfg, sessionAgentId);
	const pluginsEnabled = normalizePluginsConfig(cfg.plugins).enabled;
	const manifestMetadataSnapshot = pluginsEnabled ? loadManifestMetadataSnapshot({
		config: cfg,
		workspaceDir,
		env: process.env
	}) : void 0;
	const modelManifestContext = { manifestPlugins: manifestMetadataSnapshot?.plugins ?? [] };
	const configuredModel = resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: pluginsEnabled,
		...modelManifestContext
	});
	const configuredThinkingCatalog = buildConfiguredModelCatalog({
		cfg,
		workspaceDir,
		...modelManifestContext
	});
	const configuredThinkingRuntime = resolveEffectiveAgentRuntime({
		cfg,
		provider: configuredModel.provider,
		modelId: configuredModel.model,
		agentId: sessionAgentId,
		sessionKey,
		sessionEntry: sessionEntryRaw
	});
	const thinkingLevelsHint = formatThinkingLevels(configuredModel.provider, configuredModel.model, ", ", configuredThinkingCatalog.length > 0 ? configuredThinkingCatalog : void 0, configuredThinkingRuntime);
	const thinkOverride = normalizeThinkLevel(opts.thinking);
	const thinkOnce = normalizeThinkLevel(opts.thinkingOnce);
	if (opts.thinking && !thinkOverride) throw new Error(`Invalid thinking level. Use one of: ${thinkingLevelsHint}.`);
	if (opts.thinkingOnce && !thinkOnce) throw new Error(`Invalid one-shot thinking level. Use one of: ${thinkingLevelsHint}.`);
	await ensureAgentWorkspace({
		dir: workspaceDirRaw,
		ensureBootstrapFiles: !agentCfg?.skipBootstrap,
		skipOptionalBootstrapFiles: agentCfg?.skipOptionalBootstrapFiles
	});
	const runId = opts.runId?.trim() || sessionId;
	const { getAcpSessionManager } = await loadAcpManagerRuntime();
	const acpManager = getAcpSessionManager();
	const acpResolution = sessionKey ? acpManager.resolveSession({
		cfg,
		sessionKey
	}) : null;
	return {
		opts: commandOpts,
		body: !isRawModelRun && acpResolution?.kind === "ready" ? resolveAcpPromptBody(message, opts.internalEvents) : prependInternalEventContext(message, opts.internalEvents),
		transcriptBody: opts.transcriptMessage ?? resolveInternalEventTranscriptBody(message, opts.internalEvents),
		cfg,
		configuredThinkingCatalog,
		normalizedSpawned,
		agentCfg,
		thinkOverride,
		thinkOnce,
		verboseOverride,
		timeoutMs,
		runTimeoutOverrideMs,
		sessionId,
		sessionKey,
		sessionEntry: sessionEntryRaw,
		sessionStore,
		storePath,
		isNewSession,
		persistedThinking,
		persistedVerbose,
		sessionAgentId,
		outboundSession,
		workspaceDir,
		cwd: cwd ? resolveUserPath(cwd) : void 0,
		agentDir,
		pluginsEnabled,
		manifestMetadataSnapshot,
		modelManifestContext,
		runId,
		isSubagentLane,
		acpManager,
		acpResolution
	};
}
async function agentCommandInternal(initialOpts, runtime = defaultRuntime, deps) {
	const resolvedDeps = await resolveAgentCommandDeps(deps);
	const isRawModelRun = initialOpts.modelRun === true || initialOpts.promptMode === "none";
	const suppressVisibleSessionEffects = initialOpts.sessionEffects === "internal";
	const preserveUserFacingSessionModelState = initialOpts.preserveUserFacingSessionModelState === true;
	const prepared = await prepareAgentCommandExecution(initialOpts, runtime);
	const lifecycleAbortController = new AbortController();
	const opts = {
		...prepared.opts,
		abortSignal: prepared.opts.abortSignal ? AbortSignal.any([prepared.opts.abortSignal, lifecycleAbortController.signal]) : lifecycleAbortController.signal
	};
	const { body, transcriptBody, cfg, configuredThinkingCatalog, normalizedSpawned, agentCfg, thinkOverride, thinkOnce, verboseOverride, timeoutMs, runTimeoutOverrideMs, sessionId, sessionKey, sessionStore, storePath, isNewSession, persistedThinking, persistedVerbose, sessionAgentId, outboundSession, workspaceDir, cwd, agentDir, runId, isSubagentLane, acpManager, acpResolution, pluginsEnabled, manifestMetadataSnapshot, modelManifestContext } = prepared;
	let lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(runId);
	assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
	const effectiveCwd = cwd ? resolveUserPath(cwd) : workspaceDir;
	let sessionEntry = prepared.sessionEntry;
	let sessionReboundDuringRun = false;
	let trackedRestartRecoveryDeliveryContext = false;
	let currentRunDeliveryContext;
	const preparedSessionId = sessionEntry?.sessionId;
	const sessionStoreRuntime = storePath && sessionKey ? await loadSessionStoreRuntime() : void 0;
	const sessionWorkAdmission = await beginSessionWorkAdmission({
		scope: storePath ?? `agent:${sessionAgentId}`,
		identities: [sessionKey, sessionId],
		signal: opts.abortSignal,
		onInterrupt: () => lifecycleAbortController.abort(createAgentRunRestartAbortError()),
		assertAllowed: () => {
			const currentEntry = sessionStoreRuntime && storePath && sessionKey ? sessionStoreRuntime.loadSessionEntry({
				storePath,
				sessionKey,
				readConsistency: "latest"
			}) : sessionEntry;
			if (!currentEntry && preparedSessionId) throw new Error(`Session "${sessionKey ?? sessionId}" changed while starting work. Retry.`);
			const matchesIntentionalRollover = isNewSession && currentEntry?.sessionId === preparedSessionId;
			if (currentEntry && currentEntry.sessionId !== sessionId && !matchesIntentionalRollover) throw new Error(`Session "${sessionKey ?? sessionId}" changed while starting work. Retry.`);
			const archivedSessionError = resolveSessionWorkStartError(sessionKey ?? sessionId, currentEntry);
			if (archivedSessionError) throw new Error(archivedSessionError);
			sessionEntry = currentEntry;
			if (sessionStore && sessionKey) if (currentEntry) sessionStore[sessionKey] = currentEntry;
			else delete sessionStore[sessionKey];
		}
	});
	try {
		return await sessionWorkAdmission.run(async () => {
			if (opts.deliver === true) {
				if (resolveSendPolicy({
					cfg,
					entry: sessionEntry,
					sessionKey,
					channel: sessionEntry?.channel,
					chatType: sessionEntry?.chatType
				}) === "deny") throw new Error("send blocked by session policy");
			}
			if (!isRawModelRun && acpResolution?.kind === "stale") throw acpResolution.error;
			if (sessionStore && sessionKey && !suppressVisibleSessionEffects && !isSubagentSessionKey(sessionKey)) {
				const now = Date.now();
				const currentStoreEntry = sessionStore[sessionKey];
				const allowCreateRestartRecoveryEntry = currentStoreEntry === void 0 && sessionEntry === void 0;
				const initialEntry = currentStoreEntry ?? sessionEntry ?? {
					sessionId,
					updatedAt: now,
					sessionStartedAt: now
				};
				const isSessionRollover = isNewSession && initialEntry.sessionId !== sessionId;
				const entry = isSessionRollover ? clearRotatedSessionMetadata(initialEntry) : initialEntry;
				currentRunDeliveryContext = await resolveCurrentRunDeliveryContext({
					cfg,
					opts,
					sessionEntry: entry
				});
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				const next = {
					...entry,
					sessionId,
					updatedAt: now,
					sessionStartedAt: isSessionRollover ? now : entry.sessionStartedAt,
					lastInteractionAt: isSessionRollover ? now : entry.lastInteractionAt,
					restartRecoveryDeliveryContext: currentRunDeliveryContext,
					restartRecoveryDeliveryRunId: currentRunDeliveryContext ? runId : void 0
				};
				const persisted = await persistSessionEntry({
					sessionStore,
					sessionKey,
					storePath,
					initialEntry,
					entry: next,
					shouldPersist: (current) => isSessionRollover ? current?.sessionId === initialEntry.sessionId : shouldPersistRestartRecoveryContextClaim(current, sessionId, runId, allowCreateRestartRecoveryEntry)
				});
				sessionEntry = persisted ?? sessionEntry;
				trackedRestartRecoveryDeliveryContext = Boolean(persisted?.restartRecoveryDeliveryContext) && persisted?.restartRecoveryDeliveryRunId === runId;
			}
			if (!isRawModelRun && acpResolution?.kind === "ready" && sessionKey) {
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				const attemptExecutionRuntime = await loadAttemptExecutionRuntime();
				const acpToolTracker = attemptExecutionRuntime.createAcpToolLifecycleTracker();
				const startedAt = Date.now();
				registerAgentRunContext(runId, {
					sessionKey,
					sessionId,
					agentId: sessionAgentId,
					lifecycleGeneration,
					...suppressVisibleSessionEffects ? { isControlUiVisible: false } : {}
				});
				attemptExecutionRuntime.emitAcpLifecycleStart({
					runId,
					startedAt,
					agentId: sessionAgentId,
					lifecycleGeneration
				});
				const visibleTextAccumulator = attemptExecutionRuntime.createAcpVisibleTextAccumulator();
				let stopReason;
				let resultStatus;
				let terminalOutcome;
				try {
					const { resolveAcpAgentPolicyError, resolveAcpDispatchPolicyError, resolveAcpExplicitTurnPolicyError } = await loadAcpPolicyRuntime();
					const turnPolicyError = opts.acpTurnSource === "manual_spawn" ? resolveAcpExplicitTurnPolicyError(cfg) : resolveAcpDispatchPolicyError(cfg);
					if (turnPolicyError) {
						terminalOutcome = "blocked";
						throw turnPolicyError;
					}
					const acpAgent = normalizeAgentId(acpResolution.meta.agent || resolveAgentIdFromSessionKey(sessionKey));
					const agentPolicyError = resolveAcpAgentPolicyError(cfg, acpAgent);
					if (agentPolicyError) {
						terminalOutcome = "blocked";
						throw agentPolicyError;
					}
					const acpImageAttachments = resolveInlineAgentImageAttachments(opts.images);
					assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
					await acpManager.runTurn({
						cfg,
						sessionKey,
						text: body,
						attachments: acpImageAttachments.length > 0 ? acpImageAttachments : void 0,
						mode: "prompt",
						requestId: runId,
						signal: opts.abortSignal,
						onLifecycle: (event) => {
							if (event.type === "prompt_submitted") attemptExecutionRuntime.emitAcpPromptSubmitted({
								runId,
								sessionKey,
								at: event.at
							});
						},
						onEvent: (event) => {
							if (event.type !== "text_delta") attemptExecutionRuntime.emitAcpRuntimeEvent({
								runId,
								toolTracker: acpToolTracker,
								sessionKey,
								agentId: sessionAgentId,
								abortSignal: opts.abortSignal,
								event
							});
							if (event.type === "done") {
								stopReason = event.stopReason;
								resultStatus = event.status;
								return;
							}
							if (event.type !== "text_delta") return;
							if (event.stream && event.stream !== "output") return;
							if (!event.text) return;
							const visibleUpdate = visibleTextAccumulator.consume(event.text);
							if (!visibleUpdate) return;
							attemptExecutionRuntime.emitAcpAssistantDelta({
								runId,
								text: visibleUpdate.text,
								delta: visibleUpdate.delta
							});
						}
					});
					if (isAgentRunRestartAbortReason(opts.abortSignal?.reason)) throw opts.abortSignal?.reason;
				} catch (error) {
					const { toAcpRuntimeError } = await loadAcpRuntimeErrorsRuntime();
					const acpError = toAcpRuntimeError({
						error,
						fallbackCode: "ACP_TURN_FAILED",
						fallbackMessage: "ACP turn failed before completion."
					});
					attemptExecutionRuntime.emitAcpLifecycleError({
						runId,
						toolTracker: acpToolTracker,
						error: acpError,
						sessionKey,
						agentId: sessionAgentId,
						lifecycleGeneration,
						abortSignal: opts.abortSignal,
						...terminalOutcome ? { terminalOutcome } : {}
					});
					throw acpError;
				}
				const finalTextRaw = visibleTextAccumulator.finalizeRaw();
				const finalText = visibleTextAccumulator.finalize();
				try {
					const [{ resolveAcpSessionCwd }, { resolveSessionTranscriptFile }] = await Promise.all([loadAcpSessionIdentifiersRuntime(), loadTranscriptResolveRuntime()]);
					const internalSource = suppressVisibleSessionEffects ? await resolveSessionTranscriptFile({
						sessionId,
						sessionKey,
						sessionEntry,
						agentId: sessionAgentId,
						threadId: opts.threadId
					}) : void 0;
					const internalSessionFile = suppressVisibleSessionEffects ? await prepareInternalSessionEffectsTranscript({
						sessionFile: internalSource?.sessionFile,
						runId
					}) : void 0;
					const transcriptSessionEntry = internalSessionFile ? {
						...sessionEntry ?? {
							sessionId,
							updatedAt: Date.now(),
							sessionStartedAt: Date.now()
						},
						sessionId,
						sessionFile: internalSessionFile
					} : sessionEntry;
					sessionEntry = (await attemptExecutionRuntime.persistAcpTurnTranscript({
						body,
						transcriptBody,
						...opts.suppressPromptPersistence !== true && opts.transcriptMedia?.length ? { userInput: {
							text: transcriptBody,
							media: opts.transcriptMedia,
							mediaOnlyText: "[User sent media without caption]"
						} } : {},
						finalText: finalTextRaw,
						sessionId,
						sessionKey,
						sessionEntry: transcriptSessionEntry,
						sessionStore: suppressVisibleSessionEffects ? void 0 : sessionStore,
						storePath: suppressVisibleSessionEffects ? void 0 : storePath,
						sessionAgentId,
						threadId: opts.threadId,
						sessionCwd: resolveAcpSessionCwd(acpResolution.meta) ?? workspaceDir,
						config: cfg
					})).sessionEntry;
					if (internalSessionFile) sessionEntry = prepared.sessionEntry;
				} catch (error) {
					log.warn(`ACP transcript persistence failed for ${sessionKey}: ${formatErrorMessage(error)}`);
				}
				const restartAbortReason = opts.abortSignal?.reason;
				if (isAgentRunRestartAbortReason(restartAbortReason)) {
					attemptExecutionRuntime.emitAcpLifecycleError({
						runId,
						toolTracker: acpToolTracker,
						error: restartAbortReason,
						sessionKey,
						agentId: sessionAgentId,
						lifecycleGeneration,
						abortSignal: opts.abortSignal
					});
					throw restartAbortReason;
				}
				attemptExecutionRuntime.emitAcpLifecycleEnd({
					runId,
					toolTracker: acpToolTracker,
					agentId: sessionAgentId,
					lifecycleGeneration,
					abortSignal: opts.abortSignal,
					stopReason,
					resultStatus
				});
				const result = applyAgentRunAbortMetadata(attemptExecutionRuntime.buildAcpResult({
					payloadText: finalText,
					startedAt,
					stopReason,
					resultStatus,
					abortSignal: opts.abortSignal
				}), opts.abortSignal);
				const payloads = result.payloads;
				const { deliverAgentCommandResult } = await loadDeliveryRuntime();
				return await deliverAgentCommandResult({
					cfg,
					deps: resolvedDeps,
					runtime,
					opts,
					outboundSession,
					sessionEntry,
					result,
					payloads,
					assertDeliveryCurrent: () => assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration)
				});
			}
			const requestedThinkLevel = thinkOnce ?? thinkOverride ?? persistedThinking;
			const resolvedVerboseLevel = verboseOverride ?? persistedVerbose ?? agentCfg?.verboseDefault;
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			if (sessionKey || suppressVisibleSessionEffects) registerAgentRunContext(runId, {
				...sessionKey ? {
					sessionKey,
					sessionId
				} : {},
				agentId: sessionAgentId,
				lifecycleGeneration,
				verboseLevel: resolvedVerboseLevel,
				isControlUiVisible: !suppressVisibleSessionEffects
			});
			const skillFilter = resolveEffectiveAgentSkillFilter(cfg, sessionAgentId);
			const currentSkillsSnapshot = sessionEntry?.skillsSnapshot;
			const [{ getRemoteSkillEligibility, resolveReusableWorkspaceSkillSnapshot }, { canExecRequestNode }] = await Promise.all([loadSkillsRuntime(), loadExecDefaultsRuntime()]);
			const skillSnapshotState = resolveReusableWorkspaceSkillSnapshot({
				workspaceDir,
				config: cfg,
				agentId: sessionAgentId,
				existingSnapshot: isNewSession ? void 0 : currentSkillsSnapshot,
				skillFilter,
				eligibility: { remote: getRemoteSkillEligibility({ advertiseExecNode: canExecRequestNode({
					cfg,
					sessionEntry,
					sessionKey,
					agentId: sessionAgentId
				}) }) },
				watch: false
			});
			const needsSkillsSnapshot = isNewSession || !currentSkillsSnapshot || skillSnapshotState.shouldRefresh;
			const skillsSnapshot = skillSnapshotState.snapshot;
			if (skillsSnapshot && sessionStore && sessionKey && needsSkillsSnapshot && !suppressVisibleSessionEffects) {
				const now = Date.now();
				const current = sessionEntry ?? {
					sessionId,
					updatedAt: now,
					sessionStartedAt: now
				};
				const next = {
					...current,
					sessionId,
					updatedAt: now,
					sessionStartedAt: current.sessionStartedAt ?? now,
					skillsSnapshot
				};
				sessionEntry = await persistSessionEntry({
					sessionStore,
					sessionKey,
					storePath,
					initialEntry: current,
					entry: next
				}) ?? sessionEntry;
			}
			const hasInitialSessionOverrides = Boolean(verboseOverride);
			const shouldPersistInitialSessionTouch = opts.skipInitialSessionTouch !== true || hasInitialSessionOverrides;
			if (sessionStore && sessionKey && !suppressVisibleSessionEffects && shouldPersistInitialSessionTouch) {
				const now = Date.now();
				const entry = sessionStore[sessionKey] ?? sessionEntry ?? {
					sessionId,
					updatedAt: now,
					sessionStartedAt: now
				};
				const next = {
					...entry,
					sessionId,
					updatedAt: now,
					sessionStartedAt: entry.sessionStartedAt ?? now,
					lastInteractionAt: now
				};
				applyVerboseOverride(next, verboseOverride);
				sessionEntry = await persistSessionEntry({
					sessionStore,
					sessionKey,
					storePath,
					initialEntry: entry,
					entry: next
				}) ?? sessionEntry;
			}
			const configuredDefaultRef = resolveDefaultModelForAgent({
				cfg,
				agentId: sessionAgentId,
				allowPluginNormalization: pluginsEnabled,
				...modelManifestContext
			});
			const runContext = resolveAgentRunContext(opts);
			const { provider: defaultProvider, model: defaultModel } = normalizeAgentCommandDefaultModelRef(cfg, configuredDefaultRef.provider, configuredDefaultRef.model, modelManifestContext);
			let provider = defaultProvider;
			let model = defaultModel;
			const hasAllowlist = agentCfg?.models && Object.keys(agentCfg.models).length > 0;
			const hasStoredOverride = Boolean(sessionEntry?.modelOverride || sessionEntry?.providerOverride);
			let storedModelOverrideSource = hasStoredOverride ? sessionEntry?.modelOverrideSource : void 0;
			let hasStoredAutoFallbackProvenance = hasStoredOverride && hasSessionAutoModelFallbackProvenance(sessionEntry);
			let hasLegacyAutoFallbackOverrideWithoutOrigin = hasStoredOverride && hasLegacyAutoFallbackWithoutOrigin(sessionEntry);
			const explicitProviderOverride = typeof opts.provider === "string" ? normalizeExplicitOverrideInput(opts.provider, "provider") : void 0;
			const explicitModelOverride = typeof opts.model === "string" ? normalizeExplicitOverrideInput(opts.model, "model") : void 0;
			const hasExplicitRunOverride = Boolean(explicitProviderOverride || explicitModelOverride);
			if (hasExplicitRunOverride && opts.allowModelOverride !== true) throw new Error("Model override is not authorized for this caller.");
			const needsModelCatalog = Boolean(hasAllowlist);
			let allowedModelCatalog = [];
			let modelCatalog = null;
			let visibilityPolicy = createModelVisibilityPolicy({
				cfg,
				catalog: [],
				defaultProvider,
				defaultModel,
				allowManifestNormalization: true,
				allowPluginNormalization: pluginsEnabled,
				...modelManifestContext
			});
			if (needsModelCatalog) {
				modelCatalog = pluginsEnabled ? loadManifestModelCatalog({
					config: cfg,
					workspaceDir
				}) : [];
				visibilityPolicy = createModelVisibilityPolicy({
					cfg,
					catalog: modelCatalog,
					defaultProvider,
					defaultModel,
					agentId: sessionAgentId,
					allowManifestNormalization: true,
					allowPluginNormalization: pluginsEnabled,
					...modelManifestContext
				});
				allowedModelCatalog = visibilityPolicy.allowedCatalog;
			}
			if (sessionEntry && sessionStore && sessionKey && hasStoredOverride && !suppressVisibleSessionEffects) {
				const initialEntry = sessionEntry;
				const entry = { ...sessionEntry };
				let entryUpdated = false;
				if (hasLegacyAutoFallbackOverrideWithoutOrigin) {
					const { updated } = applyModelOverrideToSessionEntry({
						entry,
						selection: {
							provider: defaultProvider,
							model: defaultModel,
							isDefault: true
						}
					});
					if (updated) {
						storedModelOverrideSource = void 0;
						entryUpdated = true;
					}
				}
				if (repairProviderWrappedModelOverride({
					entry,
					defaultProvider,
					defaultModel
				}).updated) entryUpdated = true;
				const overrideProvider = entry.providerOverride?.trim() || defaultProvider;
				const overrideModel = entry.modelOverride?.trim();
				if (overrideModel) {
					const normalizedOverride = normalizeAgentCommandModelRef(cfg, overrideProvider, overrideModel, modelManifestContext);
					const key = modelKey(normalizedOverride.provider, normalizedOverride.model);
					if (!visibilityPolicy.allowsKey(key)) {
						const { updated } = applyModelOverrideToSessionEntry({
							entry,
							selection: {
								provider: defaultProvider,
								model: defaultModel,
								isDefault: true
							}
						});
						if (updated) entryUpdated = true;
					}
				}
				if (entryUpdated) {
					sessionEntry = await persistSessionEntry({
						sessionStore,
						sessionKey,
						storePath,
						initialEntry,
						entry
					}) ?? sessionEntry;
					const adoptedHasStoredOverride = Boolean(sessionEntry.modelOverride || sessionEntry.providerOverride);
					storedModelOverrideSource = adoptedHasStoredOverride ? sessionEntry.modelOverrideSource : void 0;
					hasStoredAutoFallbackProvenance = adoptedHasStoredOverride && hasSessionAutoModelFallbackProvenance(sessionEntry);
					hasLegacyAutoFallbackOverrideWithoutOrigin = adoptedHasStoredOverride && hasLegacyAutoFallbackWithoutOrigin(sessionEntry);
				}
			}
			const storedProviderOverride = hasLegacyAutoFallbackOverrideWithoutOrigin ? void 0 : sessionEntry?.providerOverride?.trim();
			let storedModelOverride = hasLegacyAutoFallbackOverrideWithoutOrigin ? void 0 : sessionEntry?.modelOverride?.trim();
			const currentRunModelChannel = [
				runContext.messageChannel,
				opts.replyChannel,
				opts.channel
			].find((channel) => Boolean(channel && isDeliverableMessageChannel(channel)));
			const channelOverrideGroupId = currentRunModelChannel ? runContext.groupId ?? sessionEntry?.groupId ?? runContext.currentChannelId : sessionEntry?.groupId ?? runContext.groupId ?? runContext.currentChannelId;
			const channelModelOverride = cfg.channels?.modelByChannel && !hasExplicitRunOverride ? resolveChannelModelOverride({
				cfg,
				channel: currentRunModelChannel ?? sessionEntry?.channel ?? sessionEntry?.lastChannel ?? sessionEntry?.origin?.provider,
				groupId: channelOverrideGroupId,
				groupChatType: sessionEntry?.chatType ?? sessionEntry?.origin?.chatType,
				groupChannel: runContext.groupChannel ?? sessionEntry?.groupChannel,
				groupSubject: sessionEntry?.subject,
				parentSessionKey: sessionEntry?.parentSessionKey ?? sessionKey,
				directUserIds: [
					sessionEntry?.origin?.nativeDirectUserId,
					sessionEntry?.origin?.from,
					sessionEntry?.origin?.to
				]
			}) : null;
			const normalizedChannelOverride = channelModelOverride ? parseAgentCommandModelRef(cfg, channelModelOverride.model, defaultProvider, modelManifestContext) : null;
			const primaryProvider = normalizedChannelOverride?.provider ?? defaultProvider;
			const primaryModel = normalizedChannelOverride?.model ?? defaultModel;
			if (normalizedChannelOverride && !Boolean(storedProviderOverride || storedModelOverride)) {
				provider = normalizedChannelOverride.provider;
				model = normalizedChannelOverride.model;
			}
			if (storedModelOverride) {
				const normalizedStored = normalizeAgentCommandModelRef(cfg, storedProviderOverride || defaultProvider, storedModelOverride, modelManifestContext);
				const key = modelKey(normalizedStored.provider, normalizedStored.model);
				if (visibilityPolicy.allowsKey(key)) {
					provider = normalizedStored.provider;
					model = normalizedStored.model;
				}
			}
			const autoFallbackPrimaryProbe = !hasExplicitRunOverride ? resolveAutoFallbackPrimaryProbe({
				entry: sessionEntry,
				sessionKey,
				primaryProvider,
				primaryModel
			}) : void 0;
			let autoFallbackPrimaryProbeSessionEntry;
			if (autoFallbackPrimaryProbe && sessionEntry) {
				provider = autoFallbackPrimaryProbe.provider;
				model = autoFallbackPrimaryProbe.model;
				autoFallbackPrimaryProbeSessionEntry = { ...sessionEntry };
				clearAutoFallbackPrimaryProbeSelection(autoFallbackPrimaryProbeSessionEntry);
			}
			let providerForAuthProfileValidation = provider;
			if (hasExplicitRunOverride) {
				const explicitRef = explicitModelOverride ? explicitProviderOverride ? normalizeAgentCommandModelRef(cfg, explicitProviderOverride, explicitModelOverride, modelManifestContext) : parseAgentCommandModelRef(cfg, explicitModelOverride, provider, modelManifestContext) : explicitProviderOverride ? normalizeAgentCommandModelRef(cfg, explicitProviderOverride, model, modelManifestContext) : null;
				if (!explicitRef) throw new Error("Invalid model override.");
				const explicitKey = modelKey(explicitRef.provider, explicitRef.model);
				if (!visibilityPolicy.allowsKey(explicitKey)) throw new Error(`Model override "${sanitizeForLog(explicitRef.provider)}/${sanitizeForLog(explicitRef.model)}" is not allowed for agent "${sessionAgentId}".`);
				provider = explicitRef.provider;
				model = explicitRef.model;
			}
			const allowedInitialSelection = visibilityPolicy.resolveSelection({
				provider,
				model
			});
			if (!allowedInitialSelection) throw new Error(`Configured default model "${modelKey(provider, model)}" is not allowed by agents.defaults.models, and no allowed model is available.`);
			provider = allowedInitialSelection.provider;
			model = allowedInitialSelection.model;
			providerForAuthProfileValidation = provider;
			await ensureSelectedAgentHarnessPlugin({
				config: cfg,
				provider,
				modelId: model,
				agentId: sessionAgentId,
				sessionKey,
				agentHarnessRuntimeOverride: resolveSessionRuntimeOverrideForProvider({
					provider,
					entry: sessionEntry,
					cfg
				}),
				workspaceDir
			});
			let sessionEntryForAttempt = autoFallbackPrimaryProbeSessionEntry ?? sessionEntry;
			if (sessionEntryForAttempt) {
				const authProfileId = sessionEntryForAttempt.authProfileOverride;
				if (authProfileId) {
					const entry = sessionEntryForAttempt;
					const profile = ensureAuthProfileStore().profiles[authProfileId];
					const validationHarnessPolicy = resolveAvailableAgentHarnessPolicy({
						provider: providerForAuthProfileValidation,
						modelId: model,
						config: cfg,
						agentId: sessionAgentId,
						sessionKey
					});
					const acceptedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
						provider: providerForAuthProfileValidation,
						harnessRuntime: validationHarnessPolicy.runtime,
						config: cfg
					}).map((candidateProvider) => pluginsEnabled ? resolveProviderIdForAuth(candidateProvider, {
						config: cfg,
						workspaceDir,
						...manifestMetadataSnapshot ? { metadataSnapshot: manifestMetadataSnapshot } : {}
					}) : candidateProvider);
					const authAliasLookupParams = pluginsEnabled ? {
						config: cfg,
						workspaceDir,
						...manifestMetadataSnapshot ? { metadataSnapshot: manifestMetadataSnapshot } : {}
					} : {
						config: cfg,
						workspaceDir,
						metadataSnapshot: { plugins: [] }
					};
					if (!(profile && acceptedAuthProviders.some((candidateProvider) => isStoredCredentialCompatibleWithAuthProvider({
						cfg,
						authAliasLookupParams,
						provider: candidateProvider,
						credential: profile
					})))) {
						if (hasExplicitRunOverride || autoFallbackPrimaryProbe) sessionEntryForAttempt = {
							...entry,
							authProfileOverride: void 0,
							authProfileOverrideSource: void 0,
							authProfileOverrideCompactionCount: void 0
						};
						else if (sessionStore && sessionKey && !suppressVisibleSessionEffects) await clearSessionAuthProfileOverride({
							sessionEntry: entry,
							sessionStore,
							sessionKey,
							storePath
						});
					}
				}
			}
			const catalogForThinking = allowedModelCatalog.length > 0 ? allowedModelCatalog : modelCatalog && modelCatalog.length > 0 ? modelCatalog : configuredThinkingCatalog;
			const thinkingCatalog = catalogForThinking.length > 0 ? catalogForThinking : void 0;
			const thinkingRuntime = resolveEffectiveAgentRuntime({
				cfg,
				provider,
				modelId: model,
				agentId: sessionAgentId,
				sessionKey,
				sessionEntry: sessionEntryForAttempt
			});
			const configuredThinkLevel = normalizeThinkLevel(resolveAgentConfig(cfg, sessionAgentId)?.thinkingDefault);
			const immutableThinkLevel = requestedThinkLevel ?? configuredThinkLevel;
			const primaryThinkLevel = immutableThinkLevel ?? resolveThinkingDefault({
				cfg,
				provider,
				model,
				catalog: thinkingCatalog,
				agentRuntime: thinkingRuntime
			});
			let effectiveTurnThinkLevel = primaryThinkLevel;
			if (!isThinkingLevelSupported({
				provider,
				model,
				level: primaryThinkLevel,
				catalog: thinkingCatalog,
				agentRuntime: thinkingRuntime
			})) {
				const explicitThink = Boolean(thinkOnce || thinkOverride);
				const isSubagentSpawnRun = isSubagentLane && isSubagentSessionKey(sessionKey);
				if (explicitThink && !isSubagentSpawnRun) throw new Error(`Thinking level "${primaryThinkLevel}" is not supported for ${provider}/${model}. Use one of: ${formatThinkingLevels(provider, model, ", ", thinkingCatalog, thinkingRuntime)}.`);
			}
			if (thinkOverride && sessionStore && sessionKey && !suppressVisibleSessionEffects) {
				const now = Date.now();
				const entry = sessionStore[sessionKey] ?? sessionEntry ?? {
					sessionId,
					updatedAt: now,
					sessionStartedAt: now
				};
				const next = {
					...entry,
					sessionId,
					updatedAt: now,
					sessionStartedAt: entry.sessionStartedAt ?? now,
					lastInteractionAt: now,
					thinkingLevel: thinkOverride
				};
				sessionEntry = await persistSessionEntry({
					sessionStore,
					sessionKey,
					storePath,
					initialEntry: entry,
					entry: next
				}) ?? sessionEntry;
				sessionEntryForAttempt = {
					...sessionEntryForAttempt ?? next,
					thinkingLevel: thinkOverride
				};
			}
			const { resolveSessionTranscriptFile } = await loadTranscriptResolveRuntime();
			let sessionFile;
			if (sessionStore && sessionKey) {
				const resolvedSessionFile = await resolveSessionTranscriptFile({
					sessionId,
					sessionKey,
					sessionStore: suppressVisibleSessionEffects ? void 0 : sessionStore,
					storePath: suppressVisibleSessionEffects ? void 0 : storePath,
					sessionEntry,
					agentId: sessionAgentId,
					threadId: opts.threadId
				});
				sessionFile = resolvedSessionFile.sessionFile;
				sessionEntry = resolvedSessionFile.sessionEntry;
			}
			if (!sessionFile) {
				const resolvedSessionFile = await resolveSessionTranscriptFile({
					sessionId,
					sessionKey: sessionKey ?? sessionId,
					storePath,
					sessionEntry,
					agentId: sessionAgentId,
					threadId: opts.threadId
				});
				sessionFile = resolvedSessionFile.sessionFile;
				sessionEntry = resolvedSessionFile.sessionEntry;
			}
			const attemptSessionFile = suppressVisibleSessionEffects ? await prepareInternalSessionEffectsTranscript({
				sessionFile,
				runId
			}) : sessionFile;
			const startedAt = Date.now();
			const attemptLifecycleState = {
				currentTurnUserMessagePersisted: false,
				lifecycleFinishing: false,
				lifecycleEnded: false
			};
			const attemptLifecycleCallbacks = createAgentAttemptLifecycleCallbacks(attemptLifecycleState);
			const transcriptMedia = opts.transcriptMedia ?? [];
			const hasTranscriptMedia = transcriptMedia.length > 0;
			const suppressUserTurnPersistence = opts.suppressPromptPersistence === true || opts.transcriptMessage === "" && !hasTranscriptMedia;
			const recorderTranscriptText = transcriptBody || void 0;
			const userTurnTranscriptRecorder = createUserTurnTranscriptRecorder({
				...!suppressUserTurnPersistence && (recorderTranscriptText || hasTranscriptMedia) ? { input: {
					text: recorderTranscriptText,
					...hasTranscriptMedia ? {
						media: transcriptMedia,
						mediaOnlyText: "[User sent media without caption]"
					} : {}
				} } : {},
				target: {
					transcriptPath: attemptSessionFile,
					sessionId,
					agentId: sessionAgentId,
					...sessionKey ? { sessionKey } : {},
					cwd: cwd ?? workspaceDir,
					config: cfg
				},
				beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
				errorContext: "agent command user turn transcript"
			});
			if (suppressUserTurnPersistence) userTurnTranscriptRecorder.markBlocked();
			let lifecycleFinishingEmitted = false;
			const emitLifecycleFinishing = (runResult) => {
				if (attemptLifecycleState.lifecycleEnded || attemptLifecycleState.lifecycleFinishing || lifecycleFinishingEmitted) return;
				lifecycleFinishingEmitted = true;
				attemptLifecycleState.lifecycleFinishing = true;
				emitAgentEvent({
					runId,
					lifecycleGeneration,
					stream: "lifecycle",
					data: {
						phase: "finishing",
						startedAt,
						endedAt: Date.now(),
						aborted: runResult.meta.aborted ?? false,
						stopReason: runResult.meta.stopReason,
						...resolveAgentRunAbortLifecycleFields(opts.abortSignal)
					}
				});
			};
			const emitLifecycleEnd = (runResult) => {
				if (attemptLifecycleState.lifecycleEnded) return;
				attemptLifecycleState.lifecycleEnded = true;
				const stopReason = runResult.meta.stopReason;
				const logLevel = resolveAgentRunLifecycleEndLogLevel(runResult.meta);
				if (logLevel) log[logLevel](`[agent] run ${runId} ended with stopReason=${stopReason}`);
				emitAgentEvent({
					runId,
					lifecycleGeneration,
					stream: "lifecycle",
					data: {
						phase: "end",
						startedAt,
						endedAt: Date.now(),
						aborted: runResult.meta.aborted ?? false,
						stopReason,
						...resolveAgentRunAbortLifecycleFields(opts.abortSignal)
					}
				});
			};
			const resolveLifecycleResultError = (runResult, includeErrorPayload) => attemptLifecycleState.lifecycleError ?? (includeErrorPayload ? runResult.payloads?.find((payload) => payload.isError === true && typeof payload.text === "string")?.text : void 0) ?? (runResult.meta.error ? "Agent run failed" : void 0);
			const emitLifecycleResultError = (runResult, fallbackExhausted) => {
				if (attemptLifecycleState.lifecycleEnded) return;
				attemptLifecycleState.lifecycleEnded = true;
				const error = resolveLifecycleResultError(runResult, fallbackExhausted) ?? (fallbackExhausted ? "All model fallback candidates failed" : "Agent run failed");
				emitAgentEvent({
					runId,
					lifecycleGeneration,
					stream: "lifecycle",
					data: {
						phase: "error",
						startedAt,
						endedAt: Date.now(),
						error,
						...runResult.meta.stopReason ? { stopReason: runResult.meta.stopReason } : {},
						...runResult.meta.livenessState ? { livenessState: runResult.meta.livenessState } : {},
						...runResult.meta.timeoutPhase ? { timeoutPhase: runResult.meta.timeoutPhase } : {},
						...typeof runResult.meta.providerStarted === "boolean" ? { providerStarted: runResult.meta.providerStarted } : {},
						...typeof runResult.meta.aborted === "boolean" ? { aborted: runResult.meta.aborted } : {},
						...runResult.meta.replayInvalid === true ? { replayInvalid: true } : {},
						...runResult.meta.yielded === true ? { yielded: true } : {},
						...fallbackExhausted ? { fallbackExhaustedFailure: true } : {}
					}
				});
			};
			const emitLifecyclePostTurnError = (error) => {
				if (attemptLifecycleState.lifecycleEnded) return;
				attemptLifecycleState.lifecycleEnded = true;
				emitAgentEvent({
					runId,
					lifecycleGeneration,
					stream: "lifecycle",
					data: {
						phase: "error",
						startedAt,
						endedAt: Date.now(),
						error: error instanceof Error ? error.message : "Agent run failed",
						...resolveAgentRunErrorLifecycleFields(error, opts.abortSignal)
					}
				});
			};
			const attemptExecutionRuntime = await loadAttemptExecutionRuntime();
			const messageChannel = resolveMessageChannel(runContext.messageChannel, opts.replyChannel ?? opts.channel);
			let result;
			let fallbackProvider = provider;
			let fallbackModel = model;
			let fallbackExhausted = false;
			const MAX_LIVE_SWITCH_RETRIES = 5;
			let liveSwitchRetries = 0;
			let autoFallbackPrimaryProbeInterruptedByLiveSwitch = false;
			const fastModeStartedAtMs = Date.now();
			const fallbackTrajectoryRecorder = createTrajectoryRuntimeRecorder({
				cfg,
				runId,
				sessionId,
				sessionKey,
				sessionFile,
				provider,
				modelId: model,
				workspaceDir
			});
			for (;;) try {
				const spawnedBy = normalizedSpawned.spawnedBy ?? sessionEntry?.spawnedBy;
				const effectiveFallbacksOverride = resolveEffectiveModelFallbacks({
					cfg,
					agentId: sessionAgentId,
					sessionKey,
					hasSessionModelOverride: hasExplicitRunOverride || Boolean(storedProviderOverride || storedModelOverride),
					modelOverrideSource: hasExplicitRunOverride ? "user" : storedModelOverrideSource,
					hasAutoFallbackProvenance: hasExplicitRunOverride ? false : hasStoredAutoFallbackProvenance
				});
				let fallbackAttemptIndex = 0;
				const fallbackRuntimeState = {};
				attemptLifecycleState.currentTurnUserMessagePersisted = false;
				const fallbackResult = await runWithModelFallback({
					cfg,
					provider,
					model,
					...modelManifestContext,
					runId,
					agentDir,
					agentId: sessionAgentId,
					sessionId,
					sessionKey: sessionKey ?? sessionId,
					resolveAgentHarnessRuntimeOverride: (candidateProvider) => resolveSessionRuntimeOverrideForProvider({
						provider: candidateProvider,
						entry: sessionEntryForAttempt,
						cfg
					}),
					prepareAgentHarnessRuntime: async ({ provider: providerValue, model: modelValue, agentHarnessRuntimeOverride }) => {
						await ensureSelectedAgentHarnessPlugin({
							config: cfg,
							provider: providerValue,
							modelId: modelValue,
							agentId: sessionAgentId,
							sessionKey,
							agentHarnessRuntimeOverride,
							workspaceDir
						});
					},
					fallbacksOverride: effectiveFallbacksOverride,
					onFallbackStep: (step) => {
						fallbackTrajectoryRecorder?.recordEvent("model.fallback_step", step);
					},
					classifyResult: ({ provider: providerLocal, model: modelLocal, result: resultLocal }) => classifyEmbeddedAgentRunResultForModelFallback({
						provider: providerLocal,
						model: modelLocal,
						result: resultLocal
					}),
					mergeExhaustedResult: mergeEmbeddedAgentRunResultForModelFallbackExhaustion,
					abortSignal: opts.abortSignal,
					run: async (providerOverride, modelOverride, runOptions) => {
						attemptLifecycleState.lifecycleError = void 0;
						attemptLifecycleState.lifecycleFinishing = false;
						attemptLifecycleState.lifecycleEnded = false;
						const isAutoFallbackPrimaryProbeCandidate = autoFallbackPrimaryProbe && providerOverride === autoFallbackPrimaryProbe.provider && modelOverride === autoFallbackPrimaryProbe.model;
						const attemptSessionEntry = autoFallbackPrimaryProbe && providerOverride === autoFallbackPrimaryProbe.fallbackProvider && !isAutoFallbackPrimaryProbeCandidate ? sessionEntry : sessionEntryForAttempt;
						if (isAutoFallbackPrimaryProbeCandidate) markAutoFallbackPrimaryProbe({
							probe: autoFallbackPrimaryProbe,
							sessionKey
						});
						const isFallbackRetry = fallbackAttemptIndex > 0;
						fallbackAttemptIndex += 1;
						opts.onActiveModelSelected?.({
							provider: providerOverride,
							model: modelOverride
						});
						const fastModeState = resolveFastModeState({
							cfg,
							provider: providerOverride,
							model: modelOverride,
							agentId: sessionAgentId,
							sessionEntry
						});
						const fastMode = opts.fastMode ?? fastModeState.mode;
						const agentHarnessRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
							provider: providerOverride,
							entry: attemptSessionEntry,
							cfg
						});
						const candidateRuntime = resolveEffectiveAgentRuntime({
							cfg,
							provider: providerOverride,
							modelId: modelOverride,
							agentId: sessionAgentId,
							sessionKey,
							sessionEntry: attemptSessionEntry
						});
						const candidateRequestedThinkLevel = immutableThinkLevel ?? resolveThinkingDefault({
							cfg,
							provider: providerOverride,
							model: modelOverride,
							catalog: thinkingCatalog,
							agentRuntime: candidateRuntime
						});
						const candidateThinkLevel = resolveCandidateThinkingLevel({
							cfg,
							provider: providerOverride,
							modelId: modelOverride,
							level: candidateRequestedThinkLevel,
							catalog: thinkingCatalog,
							agentId: sessionAgentId,
							sessionKey,
							sessionEntry: attemptSessionEntry,
							agentRuntime: candidateRuntime
						}) ?? candidateRequestedThinkLevel;
						effectiveTurnThinkLevel = candidateThinkLevel;
						return attemptExecutionRuntime.runAgentAttempt({
							providerOverride,
							modelOverride,
							modelFallbacksOverride: effectiveFallbacksOverride,
							originalProvider: provider,
							cfg,
							sessionEntry: attemptSessionEntry,
							agentHarnessRuntimeOverride,
							sessionId,
							sessionKey,
							sessionAgentId,
							sessionFile: attemptSessionFile,
							workspaceDir,
							cwd,
							body,
							transcriptBody,
							isFallbackRetry,
							resolvedThinkLevel: candidateThinkLevel,
							fastMode,
							fastModeStartedAtMs,
							fastModeAutoOnSeconds: fastMode === "auto" ? opts.fastModeAutoOnSeconds ?? fastModeState.fastAutoOnSeconds : fastModeState.fastAutoOnSeconds,
							isFinalFallbackAttempt: runOptions?.isFinalFallbackAttempt,
							timeoutMs,
							runTimeoutOverrideMs,
							runId,
							lifecycleGeneration,
							opts,
							runContext,
							spawnedBy,
							messageChannel,
							skillsSnapshot,
							resolvedVerboseLevel,
							agentDir,
							authProfileProvider: providerForAuthProfileValidation,
							sessionStore: suppressVisibleSessionEffects ? void 0 : sessionStore,
							storePath: suppressVisibleSessionEffects ? void 0 : storePath,
							pluginsEnabled,
							...manifestMetadataSnapshot ? { metadataSnapshot: manifestMetadataSnapshot } : {},
							allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
							sessionHasHistory: !isNewSession || await attemptExecutionRuntime.sessionFileHasContent(attemptSessionFile),
							fallbackRuntimeState,
							suppressPromptPersistenceOnRetry: suppressUserTurnPersistence || userTurnTranscriptRecorder.hasPersisted() || userTurnTranscriptRecorder.isBlocked() || isFallbackRetry && attemptLifecycleState.currentTurnUserMessagePersisted,
							userTurnTranscriptRecorder,
							onUserMessagePersisted: attemptLifecycleCallbacks.onUserMessagePersisted,
							onLifecycleGenerationChanged: (nextLifecycleGeneration) => {
								lifecycleGeneration = nextLifecycleGeneration;
							},
							onAgentEvent: attemptLifecycleCallbacks.onAgentEvent,
							deferTerminalLifecycle: true
						});
					}
				});
				result = applyAgentRunAbortMetadata(fallbackResult.result, opts.abortSignal);
				if (isAgentRunRestartAbortReason(opts.abortSignal?.reason)) throw opts.abortSignal?.reason;
				fallbackProvider = fallbackResult.provider;
				fallbackModel = fallbackResult.model;
				fallbackExhausted = fallbackResult.outcome === "exhausted";
				if (!fallbackExhausted && autoFallbackPrimaryProbe && !autoFallbackPrimaryProbeInterruptedByLiveSwitch && sessionEntry && sessionStore && sessionKey && !suppressVisibleSessionEffects && !preserveUserFacingSessionModelState && entryMatchesAutoFallbackPrimaryProbe(sessionEntry, autoFallbackPrimaryProbe)) {
					const nextSessionEntry = { ...sessionEntry };
					if (fallbackProvider === autoFallbackPrimaryProbe.provider && fallbackModel === autoFallbackPrimaryProbe.model) clearAutoFallbackPrimaryProbeSelection(nextSessionEntry);
					else {
						nextSessionEntry.providerOverride = fallbackProvider;
						nextSessionEntry.modelOverride = fallbackModel;
						nextSessionEntry.modelOverrideSource = "auto";
						nextSessionEntry.modelOverrideFallbackOriginProvider = autoFallbackPrimaryProbe.provider;
						nextSessionEntry.modelOverrideFallbackOriginModel = autoFallbackPrimaryProbe.model;
						if (nextSessionEntry.authProfileOverrideSource === "auto" && fallbackProvider !== autoFallbackPrimaryProbe.fallbackProvider) {
							delete nextSessionEntry.authProfileOverride;
							delete nextSessionEntry.authProfileOverrideSource;
							delete nextSessionEntry.authProfileOverrideCompactionCount;
						}
						nextSessionEntry.updatedAt = Date.now();
					}
					sessionEntry = await persistSessionEntry({
						sessionStore,
						sessionKey,
						storePath,
						initialEntry: sessionEntry,
						entry: nextSessionEntry,
						shouldPersist: (current) => Boolean(current && entryMatchesAutoFallbackPrimaryProbe(current, autoFallbackPrimaryProbe))
					}) ?? sessionEntry;
				}
				if (fallbackResult.attempts.length > 0 && result.meta.agentMeta) result = {
					...result,
					meta: {
						...result.meta,
						agentMeta: {
							...result.meta.agentMeta,
							fallbackAttempts: fallbackResult.attempts
						}
					}
				};
				if (!fallbackExhausted) emitLifecycleFinishing(result);
				break;
			} catch (err) {
				if (err instanceof LiveSessionModelSwitchError) {
					liveSwitchRetries++;
					if (liveSwitchRetries > MAX_LIVE_SWITCH_RETRIES) {
						log.error(`Live session model switch in subagent run ${runId}: exceeded maximum retries (${MAX_LIVE_SWITCH_RETRIES})`);
						if (!attemptLifecycleState.lifecycleEnded) emitAgentEvent({
							runId,
							lifecycleGeneration,
							stream: "lifecycle",
							data: {
								phase: "error",
								startedAt,
								endedAt: Date.now(),
								error: "Agent run failed"
							}
						});
						await fallbackTrajectoryRecorder?.flush();
						throw new Error(`Exceeded maximum live model switch retries (${MAX_LIVE_SWITCH_RETRIES})`, { cause: err });
					}
					const switchRef = normalizeAgentCommandModelRef(cfg, err.provider, err.model, modelManifestContext);
					const switchKey = modelKey(switchRef.provider, switchRef.model);
					if (!visibilityPolicy.allowsKey(switchKey)) {
						log.info(`Live session model switch in subagent run ${runId}: rejected ${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)} (not in allowlist)`);
						if (!attemptLifecycleState.lifecycleEnded) emitAgentEvent({
							runId,
							lifecycleGeneration,
							stream: "lifecycle",
							data: {
								phase: "error",
								startedAt,
								endedAt: Date.now(),
								error: "Agent run failed"
							}
						});
						await fallbackTrajectoryRecorder?.flush();
						throw new Error(`Live model switch rejected: ${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)} is not in the agent allowlist`, { cause: err });
					}
					const previousProvider = provider;
					const previousModel = model;
					if (autoFallbackPrimaryProbe) autoFallbackPrimaryProbeInterruptedByLiveSwitch = true;
					provider = err.provider;
					model = err.model;
					fallbackProvider = err.provider;
					fallbackModel = err.model;
					providerForAuthProfileValidation = err.provider;
					if (sessionEntry) {
						sessionEntry = { ...sessionEntry };
						if (err.agentRuntimeOverride) sessionEntry.agentRuntimeOverride = err.agentRuntimeOverride;
						else delete sessionEntry.agentRuntimeOverride;
						sessionEntry.authProfileOverride = err.authProfileId;
						sessionEntry.authProfileOverrideSource = err.authProfileId ? err.authProfileIdSource : void 0;
						sessionEntry.authProfileOverrideCompactionCount = void 0;
						sessionEntryForAttempt = sessionEntry;
					}
					if (storedModelOverride || err.model !== previousModel || err.provider !== previousProvider) {
						storedModelOverride = err.model;
						storedModelOverrideSource = "user";
					}
					attemptLifecycleState.lifecycleEnded = false;
					log.info(`Live session model switch in subagent run ${runId}: switching to ${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)}`);
					continue;
				}
				if (!attemptLifecycleState.lifecycleEnded) {
					const errorLifecycleFields = isAgentRunDirectAbortReason(err) ? {
						aborted: true,
						stopReason: "aborted"
					} : resolveAgentRunErrorLifecycleFields(err, opts.abortSignal);
					emitAgentEvent({
						runId,
						lifecycleGeneration,
						stream: "lifecycle",
						data: {
							phase: "error",
							startedAt,
							endedAt: Date.now(),
							error: err instanceof Error ? err.message : "Agent run failed",
							...errorLifecycleFields
						}
					});
				}
				await fallbackTrajectoryRecorder?.flush();
				throw err;
			}
			try {
				await fallbackTrajectoryRecorder?.flush();
				const rotatedSessionFile = result.meta.agentMeta?.sessionFile;
				const effectiveSessionId = rotatedSessionFile ? result.meta.agentMeta?.sessionId ?? sessionId : sessionId;
				const effectiveSessionFile = rotatedSessionFile ?? attemptSessionFile;
				if (sessionStore && sessionKey && !suppressVisibleSessionEffects) {
					const isHeartbeatLifecycleRun = isHeartbeatLifecycleRunKind(opts.bootstrapContextRunKind);
					const { updateSessionStoreAfterAgentRun } = await loadSessionStoreRuntime();
					await updateSessionStoreAfterAgentRun({
						cfg,
						contextTokensOverride: agentCfg?.contextTokens,
						sessionId: effectiveSessionId,
						sessionKey,
						storePath,
						sessionStore,
						defaultProvider: provider,
						defaultModel: model,
						fallbackProvider,
						fallbackModel,
						result,
						touchInteraction: opts.bootstrapContextRunKind !== "cron" && !isHeartbeatLifecycleRun && !opts.internalEvents?.length,
						touchActivity: !isHeartbeatLifecycleRun && !opts.internalEvents?.length,
						preserveRuntimeModel: fallbackExhausted || isHeartbeatLifecycleRun || preserveUserFacingSessionModelState,
						preserveUserFacingSessionModelState
					});
					sessionEntry = sessionStore[sessionKey] ?? sessionEntry;
				}
				const transcriptPersistenceRunner = result.meta.executionTrace?.runner;
				const embeddedAssistantGapFill = transcriptPersistenceRunner === "embedded" || transcriptPersistenceRunner === void 0 && Boolean(result.meta.finalAssistantVisibleText?.trim());
				if (!sessionReboundDuringRun && (transcriptPersistenceRunner === "cli" || embeddedAssistantGapFill)) {
					let persistedCliTurnTranscript = false;
					try {
						const transcriptSessionEntry = suppressVisibleSessionEffects ? {
							...sessionEntry ?? {
								sessionId: effectiveSessionId,
								updatedAt: Date.now(),
								sessionStartedAt: Date.now()
							},
							sessionId: effectiveSessionId,
							sessionFile: effectiveSessionFile
						} : sessionEntry;
						const transcriptResult = await attemptExecutionRuntime.persistCliTurnTranscript({
							body,
							transcriptBody,
							result,
							sessionId: effectiveSessionId,
							sessionKey: sessionKey ?? effectiveSessionId,
							sessionEntry: transcriptSessionEntry,
							sessionStore: suppressVisibleSessionEffects ? void 0 : sessionStore,
							storePath: suppressVisibleSessionEffects ? void 0 : storePath,
							sessionAgentId,
							threadId: opts.threadId,
							sessionCwd: effectiveCwd,
							config: cfg,
							embeddedAssistantGapFill,
							skipUserTurn: suppressUserTurnPersistence || userTurnTranscriptRecorder.hasPersisted() || userTurnTranscriptRecorder.isBlocked()
						});
						sessionEntry = transcriptResult.sessionEntry;
						sessionReboundDuringRun = transcriptResult.kind === "session-rebound";
						if (suppressVisibleSessionEffects) sessionEntry = prepared.sessionEntry;
						persistedCliTurnTranscript = transcriptResult.kind === "persisted";
					} catch (error) {
						log.warn(`Turn transcript persistence failed for ${sessionKey ?? sessionId}: ${error instanceof Error ? error.message : String(error)}`);
					}
					if (persistedCliTurnTranscript && !suppressVisibleSessionEffects) sessionEntry = await (await loadCliCompactionRuntime()).runCliTurnCompactionLifecycle({
						cfg,
						sessionId: effectiveSessionId,
						sessionKey: sessionKey ?? effectiveSessionId,
						sessionEntry,
						sessionStore,
						storePath,
						sessionAgentId,
						workspaceDir,
						cwd: effectiveCwd,
						agentDir,
						provider: result.meta.agentMeta?.provider ?? provider,
						model: result.meta.agentMeta?.model ?? model,
						skillsSnapshot,
						messageChannel,
						agentAccountId: runContext.accountId,
						senderIsOwner: opts.senderIsOwner,
						thinkLevel: effectiveTurnThinkLevel,
						extraSystemPrompt: opts.extraSystemPrompt
					});
				}
				const payloads = result.payloads ?? [];
				let pendingFinalDeliveryTextForThisRun;
				if (opts.deliver === true && sessionStore && sessionKey && !suppressVisibleSessionEffects && !sessionReboundDuringRun && payloads.length > 0 && !isSubagentSessionKey(sessionKey)) {
					const now = Date.now();
					const combinedPayload = sanitizePendingFinalDeliveryText(payloads.map((p) => typeof p.text === "string" ? p.text : "").filter(Boolean).join("\n\n"));
					pendingFinalDeliveryTextForThisRun = combinedPayload || void 0;
					if (combinedPayload) {
						const entry = sessionStore[sessionKey] ?? sessionEntry;
						const next = {
							...entry,
							pendingFinalDelivery: true,
							pendingFinalDeliveryText: combinedPayload,
							pendingFinalDeliveryContext: currentRunDeliveryContext,
							pendingFinalDeliveryCreatedAt: now,
							updatedAt: now
						};
						sessionEntry = await persistSessionEntry({
							sessionStore,
							sessionKey,
							storePath,
							initialEntry: entry,
							entry: next,
							shouldPersist: (current) => shouldPersistCurrentRunSessionCleanup(current, sessionId)
						}) ?? sessionEntry;
					}
				}
				const { deliverAgentCommandResult } = await loadDeliveryRuntime();
				const resolveFreshSessionEntryForDelivery = sessionStore && sessionKey && !suppressVisibleSessionEffects ? async () => {
					const { loadSessionStore } = await loadSessionStoreRuntime();
					const freshEntry = loadSessionStore(storePath, {
						skipCache: true,
						clone: false
					})[sessionKey];
					if (!freshEntry || freshEntry.sessionId !== effectiveSessionId) return;
					sessionStore[sessionKey] = freshEntry;
					return freshEntry;
				} : void 0;
				const deliveryParams = {
					cfg,
					deps: resolvedDeps,
					runtime,
					opts,
					outboundSession,
					sessionEntry,
					result,
					payloads,
					assertDeliveryCurrent: () => assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration)
				};
				const deliveryResult = await deliverAgentCommandResult(resolveFreshSessionEntryForDelivery ? {
					...deliveryParams,
					expectedSessionIdForFreshDelivery: effectiveSessionId,
					resolveFreshSessionEntryForDelivery
				} : deliveryParams);
				if (sessionStore && sessionKey && !isSubagentSessionKey(sessionKey) && !suppressVisibleSessionEffects && !sessionReboundDuringRun) {
					const entry = sessionStore[sessionKey] ?? sessionEntry;
					const noPendingTextForThisRun = opts.deliver === true && pendingFinalDeliveryTextForThisRun === void 0 && entry.pendingFinalDelivery === true && !entry.pendingFinalDeliveryText;
					if (deliveryResult?.deliverySucceeded === true || noPendingTextForThisRun) {
						const next = clearPendingFinalDeliveryFields(entry, Date.now());
						sessionEntry = await persistSessionEntry({
							sessionStore,
							sessionKey,
							storePath,
							initialEntry: entry,
							entry: next,
							shouldPersist: (current) => shouldPersistCurrentRunSessionCleanup(current, sessionId)
						}) ?? sessionEntry;
					}
				}
				if (fallbackExhausted || resolveLifecycleResultError(result, false)) emitLifecycleResultError(result, fallbackExhausted);
				else emitLifecycleEnd(result);
				return deliveryResult;
			} catch (error) {
				emitLifecyclePostTurnError(error);
				throw error;
			}
		});
	} finally {
		sessionWorkAdmission.release();
		if (!sessionReboundDuringRun && trackedRestartRecoveryDeliveryContext && sessionStore && sessionKey) try {
			const entry = sessionStore[sessionKey] ?? sessionEntry;
			if (entry?.restartRecoveryDeliveryContext && entry.restartRecoveryDeliveryRunId === runId) sessionEntry = await persistSessionEntry({
				sessionStore,
				sessionKey,
				storePath,
				initialEntry: entry,
				entry: {
					...entry,
					restartRecoveryDeliveryContext: void 0,
					restartRecoveryDeliveryRunId: void 0,
					updatedAt: Date.now()
				},
				shouldPersist: (current) => shouldPersistRestartRecoveryCleanup(current, sessionId, runId)
			}) ?? sessionEntry;
		} catch (error) {
			log.warn(`failed to clear restart recovery delivery context for ${sessionKey}: ${error instanceof Error ? error.message : String(error)}`);
		}
		clearAgentRunContext(runId, lifecycleGeneration);
	}
}
/** Runs an agent turn from CLI/runtime options against the resolved session and model policy. */
async function agentCommand(opts, runtime = defaultRuntime, deps) {
	const resolvedDeps = await resolveAgentCommandDeps(deps);
	const lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(opts.runId ?? "");
	return await withAgentRunLifecycleGeneration(lifecycleGeneration, () => withLocalGatewayRequestScope({
		deps: resolvedDeps,
		getRuntimeConfig
	}, async () => await agentCommandInternal({
		...opts,
		lifecycleGeneration,
		senderIsOwner: opts.senderIsOwner ?? true,
		allowModelOverride: opts.allowModelOverride ?? true
	}, runtime, resolvedDeps)));
}
/** Resolve the channel label for model.usage diagnostics from ingress run options. */
function ingressDiagnosticChannel(opts) {
	return opts.runContext?.messageChannel ?? opts.messageChannel ?? opts.channel ?? "http";
}
/**
* Emit a model.usage diagnostic event after an ingress agent run completes.
*
* Unlike channel/cron paths which emit model.usage in runReplyAgent /
* finalizeCronRun, the ingress path has no such existing emission — without
* this every diagnostics consumer (Langfuse bridge, @openclaw/diagnostics-otel,
* diagnostics-prometheus) sees usage/cost only for webchat/cli/cron turns
* and is blind to HTTP API traffic (POST /v1/responses, POST /v1/chat/completions,
* and node-event dispatch).
*/
function emitIngressModelUsageDiagnostic(result, opts) {
	const cfg = getRuntimeConfig();
	if (!isDiagnosticsEnabled(cfg)) return;
	const agentMeta = result.meta?.agentMeta;
	const usage = agentMeta?.usage;
	if (!agentMeta || !hasNonzeroUsage(usage)) return;
	const providerUsed = agentMeta.provider ?? "";
	const modelUsed = agentMeta.model ?? "";
	const input = usage.input ?? 0;
	const output = usage.output ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const usagePromptTokens = input + cacheRead + cacheWrite;
	const totalTokens = usage.total ?? usagePromptTokens + output;
	const hasBillableUsageBuckets = usage.input !== void 0 || usage.output !== void 0 || usage.cacheRead !== void 0 || usage.cacheWrite !== void 0;
	const costConfig = resolveModelCostConfig({
		provider: providerUsed,
		model: modelUsed,
		config: cfg
	});
	const costUsd = hasBillableUsageBuckets ? estimateUsageCost({
		usage,
		cost: costConfig
	}) : void 0;
	emitTrustedDiagnosticEvent({
		type: "model.usage",
		sessionKey: opts.sessionKey,
		sessionId: agentMeta.sessionId,
		channel: ingressDiagnosticChannel(opts),
		agentId: opts.agentId,
		provider: providerUsed,
		model: modelUsed,
		usage: {
			input,
			output,
			cacheRead,
			cacheWrite,
			promptTokens: usagePromptTokens,
			total: totalTokens
		},
		lastCallUsage: agentMeta.lastCallUsage,
		context: {
			limit: agentMeta.contextTokens,
			...agentMeta.promptTokens !== void 0 ? { used: agentMeta.promptTokens } : {}
		},
		costUsd,
		durationMs: result.meta?.durationMs
	});
}
/** Runs an agent turn from an inbound channel/gateway ingress context. */
async function agentCommandFromIngress(opts, runtime = defaultRuntime, deps) {
	if (typeof opts.allowModelOverride !== "boolean") throw new Error("allowModelOverride must be explicitly set for ingress agent runs.");
	const lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(opts.runId ?? "");
	return await withAgentRunLifecycleGeneration(lifecycleGeneration, async () => {
		const result = await agentCommandInternal({
			...opts,
			lifecycleGeneration,
			senderIsOwner: opts.senderIsOwner === true
		}, runtime, deps);
		if (result) emitIngressModelUsageDiagnostic(result, opts);
		return result;
	});
}
const testing = {
	resolveAgentRuntimeConfig,
	prepareAgentCommandExecution,
	resolveExplicitAgentCommandSessionKey,
	resolveAgentRunLifecycleEndLogLevel,
	ingressDiagnosticChannel,
	emitIngressModelUsageDiagnostic
};
//#endregion
export { agentCommandFromIngress as n, testing as r, agentCommand as t };
