import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as sanitizeForLog } from "./ansi-zQGMgESZ.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { l as isSecretRef } from "./types.secrets-lIZQEgMF.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { s as normalizePluginsConfig } from "./config-state-6HQcbL-X.js";
import { a as markAutoFallbackPrimaryProbe, h as resolveEffectiveModelFallbacks, i as hasLegacyAutoFallbackWithoutOrigin, m as resolveAutoFallbackPrimaryProbe, n as entryMatchesAutoFallbackPrimaryProbe, t as clearAutoFallbackPrimaryProbeSelection, v as resolveSessionAgentId, w as hasSessionAutoModelFallbackProvenance } from "./agent-scope-CDZXADgT.js";
import { a as isSubagentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { _ as scopeLegacySessionKeyToAgent, c as isUnscopedSessionKeySentinel, p as resolveAgentIdFromSessionKey, s as classifySessionKeyShape, u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { t as resolveEffectiveAgentSkillFilter } from "./agent-filter-vKovqx_z.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-C3ijpoNo.js";
import { d as readConfigFileSnapshotForWrite, i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-CNlVI3wV.js";
import { i as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-DXJmS9CT.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-mDjiWzE5.js";
import { g as normalizeVerboseLevel, n as isThinkingLevelSupported, o as resolveSupportedThinkingLevel, p as normalizeThinkLevel, t as formatThinkingLevels } from "./thinking-DxaN427I.js";
import { v as setRuntimeConfigSnapshot } from "./runtime-snapshot-D93_HOsR.js";
import { n as ensureAuthProfileStore } from "./store-SfOB_T2S.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CqVcoNpy.js";
import { i as clearAgentRunContext, m as registerAgentRunContext, n as captureAgentRunLifecycleGeneration, s as emitAgentEvent, t as assertAgentRunLifecycleGenerationCurrent, y as withAgentRunLifecycleGeneration } from "./agent-events-7y1r8HOP.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-D36KNc_D.js";
import "./message-channel-constants-Z0pS5ykd.js";
import { o as resolveMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { r as mergeSessionEntry } from "./types-CoDcFuoc.js";
import { g as patchSessionEntry } from "./session-accessor-Dx6KDG0K.js";
import { n as withPluginRuntimeGatewayRequestScope, t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BAEdAUQ6.js";
import { n as isStoredCredentialCompatibleWithAuthProvider } from "./order-DO7M8GzY.js";
import { _ as resolveConfiguredModelRef, b as resolveModelRefFromString, i as buildModelAliasIndex, r as buildConfiguredModelCatalog } from "./model-selection-shared-CKMggJal.js";
import { n as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-D4KabxN2.js";
import { a as normalizeModelRef, i as modelKey, o as normalizeProviderId } from "./model-selection-normalize-Df7baLev.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-GwbGGXiw.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-i8V2iTdL.js";
import { t as loadManifestModelCatalog } from "./model-catalog-DD_dq4PJ.js";
import { d as stripInternalRuntimeContext, l as hasInternalRuntimeContext } from "./internal-runtime-context-BH_40W4f.js";
import { d as ensureAgentWorkspace } from "./workspace-DP5mE--D.js";
import { a as isAgentRunRestartAbortReason, o as resolveAgentRunAbortLifecycleFields } from "./run-termination-CgLu4sKB.js";
import { t as resolveAgentTimeoutMs } from "./timeout-Drw0_zOv.js";
import { t as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-DHLlIudm.js";
import { t as resolveFastModeState } from "./fast-mode-BHYJgNkm.js";
import { n as resolveSendPolicy } from "./send-policy-D_O9N501.js";
import { W as createTrajectoryRuntimeRecorder, t as resolveAvailableAgentHarnessPolicy } from "./selection-Dz3q_Van.js";
import { s as normalizeSpawnedRunMetadata } from "./subagent-spawn-plan-_-imzziC.js";
import { _ as formatAgentInternalEventsForPlainPrompt, v as formatAgentInternalEventsForPrompt } from "./subagent-announce-origin-DtkqrvaG.js";
import { t as buildOutboundSessionContext } from "./session-context-BWvkIb6x.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-DAY9l73H.js";
import { o as runWithModelFallback, p as LiveSessionModelSwitchError } from "./model-fallback-xjR_RHVQ.js";
import { n as resolveSession } from "./session-DzIpXXzY.js";
import { t as getAgentRuntimeCommandSecretTargetIds } from "./command-secret-targets-8T81-Xu7.js";
import { n as repairProviderWrappedModelOverride, t as applyModelOverrideToSessionEntry } from "./model-overrides-Dajvsx8b.js";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-DBLJaeyE.js";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.js";
import { t as prepareInternalSessionEffectsTranscript } from "./internal-session-effects-CGGjBLLd.js";
import { t as resolveChannelModelOverride } from "./model-overrides-CgBDdsJs.js";
import { n as mergeEmbeddedAgentRunResultForModelFallbackExhaustion, t as classifyEmbeddedAgentRunResultForModelFallback } from "./result-fallback-classifier-HKlUx1LO.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-D4UDhDQN.js";
import "./live-model-switch-B0n1Z93Y.js";
import { r as resolveInlineAgentImageAttachments } from "./agent-turn-attachments-DSSJmbqu.js";
import { r as createChatRunEntry } from "./server-chat-state-COF_MGQr.js";
import { t as clearSessionAuthProfileOverride } from "./session-override-DvWtC0HD.js";
import { t as NodeRegistry } from "./node-registry-BZLqTDQ7.js";
import { r as resolveAgentOutboundTarget, t as resolveAgentDeliveryPlan } from "./agent-delivery-bpHtMooN.js";
import { n as applyVerboseOverride } from "./level-overrides-Dc5xNCLx.js";
import { t as resolveAgentRunContext } from "./run-context-C8rw5QEs.js";
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
	const hasRuntimeSecretRefs = hasAgentRuntimeSecretRefs({
		config: loadedRaw,
		includeChannelTargets
	});
	const sourceConfig = await (async () => {
		try {
			const { snapshot } = await readConfigFileSnapshotForWrite();
			if (snapshot.valid) return snapshot.resolved;
		} catch {}
		return loadedRaw;
	})();
	const cfg = hasRuntimeSecretRefs ? (await (await import("./command-config-resolution.runtime.js")).resolveCommandConfigWithSecrets({
		config: loadedRaw,
		commandName: "agent",
		targetIds: getAgentRuntimeCommandSecretTargetIds({ includeChannelTargets }),
		runtime
	})).resolvedConfig : loadedRaw;
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
	return params.includeChannelTargets ? hasNestedSecretRef(config.channels) : false;
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
function normalizeTranscriptMarkerUpdatedAt(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
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
		const merged = mergeSessionEntry(context.existingEntry, params.entry);
		if (params.preserveTranscriptMarkerUpdatedAt) {
			const currentUpdatedAt = normalizeTranscriptMarkerUpdatedAt(context.existingEntry?.updatedAt);
			const markerUpdatedAt = normalizeTranscriptMarkerUpdatedAt(params.entry.updatedAt);
			if (markerUpdatedAt !== void 0) merged.updatedAt = Math.max(currentUpdatedAt ?? 0, markerUpdatedAt);
		}
		for (const field of params.clearedFields ?? []) if (!Object.hasOwn(params.entry, field)) Reflect.deleteProperty(merged, field);
		return merged;
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
const acpPolicyRuntimeLoader = createLazyImportLoader(() => import("./policy-BToezNMi.js"));
const acpRuntimeErrorsRuntimeLoader = createLazyImportLoader(() => import("./errors-CV1J095B.js"));
const acpSessionIdentifiersRuntimeLoader = createLazyImportLoader(() => import("./acp-core/runtime/session-identifiers.js"));
const deliveryRuntimeLoader = createLazyImportLoader(() => import("./delivery.runtime.js"));
const sessionStoreRuntimeLoader = createLazyImportLoader(() => import("./session-store.runtime.js"));
const cliCompactionRuntimeLoader = createLazyImportLoader(() => import("./cli-compaction-C9JL6oKR.js"));
const transcriptResolveRuntimeLoader = createLazyImportLoader(() => import("./transcript-resolve.runtime.js"));
const cliDepsRuntimeLoader = createLazyImportLoader(() => import("./deps-CZ_ChSrR.js"));
const execDefaultsRuntimeLoader = createLazyImportLoader(() => import("./exec-defaults-Dsm6U--j.js"));
const skillsRuntimeLoader = createLazyImportLoader(async () => {
	const [remote, sessionSnapshot] = await Promise.all([import("./remote-CULvOFOE.js"), import("./session-snapshot-BHtlaq0Q.js")]);
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
const OVERRIDE_FIELDS_CLEARED_BY_DELETE = [
	"providerOverride",
	"modelOverride",
	"modelOverrideSource",
	"modelOverrideFallbackOriginProvider",
	"modelOverrideFallbackOriginModel",
	"authProfileOverride",
	"authProfileOverrideSource",
	"authProfileOverrideCompactionCount",
	"fallbackNoticeSelectedModel",
	"fallbackNoticeActiveModel",
	"fallbackNoticeReason",
	"claudeCliSessionId"
];
const OVERRIDE_VALUE_MAX_LENGTH = 256;
async function persistSessionEntry(params) {
	return await persistSessionEntry$1({
		...params,
		clearedFields: OVERRIDE_FIELDS_CLEARED_BY_DELETE
	});
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
	if (!opts.to && !requestedSessionId && !rawExplicitSessionKey && !opts.agentId) throw new Error("Pass --to <E.164>, --session-key, --session-id, or --agent to choose a session");
	const { cfg } = await resolveAgentRuntimeConfig(runtime, { runtimeTargetsChannelSecrets: opts.deliver === true });
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
	const commandOpts = toSessionKey ? {
		...opts,
		to: void 0,
		sessionKey: explicitSessionKey
	} : opts;
	const sessionResolution = resolveSession({
		cfg,
		to: commandOpts.to,
		sessionId: commandOpts.sessionId,
		sessionKey: explicitSessionKey,
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
	const thinkingLevelsHint = formatThinkingLevels(configuredModel.provider, configuredModel.model, ", ", configuredThinkingCatalog.length > 0 ? configuredThinkingCatalog : void 0);
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
	const opts = prepared.opts;
	const { body, transcriptBody, cfg, configuredThinkingCatalog, normalizedSpawned, agentCfg, thinkOverride, thinkOnce, verboseOverride, timeoutMs, runTimeoutOverrideMs, sessionId, sessionKey, sessionStore, storePath, isNewSession, persistedThinking, persistedVerbose, sessionAgentId, outboundSession, workspaceDir, cwd, agentDir, runId, isSubagentLane, acpManager, acpResolution, pluginsEnabled, manifestMetadataSnapshot, modelManifestContext } = prepared;
	let lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(runId);
	assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
	const effectiveCwd = cwd ? resolveUserPath(cwd) : workspaceDir;
	let sessionEntry = prepared.sessionEntry;
	let sessionReboundDuringRun = false;
	let trackedRestartRecoveryDeliveryContext = false;
	let currentRunDeliveryContext;
	try {
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
			const entry = currentStoreEntry ?? sessionEntry ?? {
				sessionId,
				updatedAt: now,
				sessionStartedAt: now
			};
			currentRunDeliveryContext = await resolveCurrentRunDeliveryContext({
				cfg,
				opts,
				sessionEntry: entry
			});
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			const persisted = await persistSessionEntry({
				sessionStore,
				sessionKey,
				storePath,
				entry: {
					...entry,
					sessionId,
					updatedAt: now,
					restartRecoveryDeliveryContext: currentRunDeliveryContext,
					restartRecoveryDeliveryRunId: currentRunDeliveryContext ? runId : void 0
				},
				shouldPersist: (current) => shouldPersistRestartRecoveryContextClaim(current, sessionId, runId, allowCreateRestartRecoveryEntry)
			});
			sessionEntry = persisted ?? sessionEntry;
			trackedRestartRecoveryDeliveryContext = Boolean(persisted?.restartRecoveryDeliveryContext) && persisted?.restartRecoveryDeliveryRunId === runId;
		}
		if (!isRawModelRun && acpResolution?.kind === "ready" && sessionKey) {
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			const attemptExecutionRuntime = await loadAttemptExecutionRuntime();
			const startedAt = Date.now();
			registerAgentRunContext(runId, suppressVisibleSessionEffects ? {
				isControlUiVisible: false,
				lifecycleGeneration
			} : {
				sessionKey,
				sessionId,
				lifecycleGeneration
			});
			attemptExecutionRuntime.emitAcpLifecycleStart({
				runId,
				startedAt,
				lifecycleGeneration
			});
			const visibleTextAccumulator = attemptExecutionRuntime.createAcpVisibleTextAccumulator();
			let stopReason;
			try {
				const { resolveAcpAgentPolicyError, resolveAcpDispatchPolicyError, resolveAcpExplicitTurnPolicyError } = await loadAcpPolicyRuntime();
				const turnPolicyError = opts.acpTurnSource === "manual_spawn" ? resolveAcpExplicitTurnPolicyError(cfg) : resolveAcpDispatchPolicyError(cfg);
				if (turnPolicyError) throw turnPolicyError;
				const agentPolicyError = resolveAcpAgentPolicyError(cfg, normalizeAgentId(acpResolution.meta.agent || resolveAgentIdFromSessionKey(sessionKey)));
				if (agentPolicyError) throw agentPolicyError;
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
							sessionKey,
							event
						});
						if (event.type === "done") {
							stopReason = event.stopReason;
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
					error: acpError,
					sessionKey,
					lifecycleGeneration,
					abortSignal: opts.abortSignal
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
					error: restartAbortReason,
					sessionKey,
					lifecycleGeneration,
					abortSignal: opts.abortSignal
				});
				throw restartAbortReason;
			}
			attemptExecutionRuntime.emitAcpLifecycleEnd({
				runId,
				lifecycleGeneration,
				abortSignal: opts.abortSignal
			});
			const result = applyAgentRunAbortMetadata(attemptExecutionRuntime.buildAcpResult({
				payloadText: finalText,
				startedAt,
				stopReason,
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
		let resolvedThinkLevel = thinkOnce ?? thinkOverride ?? persistedThinking;
		const resolvedVerboseLevel = verboseOverride ?? persistedVerbose ?? agentCfg?.verboseDefault;
		assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
		if (sessionKey || suppressVisibleSessionEffects) registerAgentRunContext(runId, {
			...sessionKey && !suppressVisibleSessionEffects ? {
				sessionKey,
				sessionId
			} : {},
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
			await persistSessionEntry({
				sessionStore,
				sessionKey,
				storePath,
				entry: next
			});
			sessionEntry = next;
		}
		const hasInitialSessionOverrides = Boolean(thinkOverride || verboseOverride);
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
			if (thinkOverride) next.thinkingLevel = thinkOverride;
			applyVerboseOverride(next, verboseOverride);
			await persistSessionEntry({
				sessionStore,
				sessionKey,
				storePath,
				entry: next
			});
			sessionEntry = next;
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
		const hasStoredAutoFallbackProvenance = hasStoredOverride && hasSessionAutoModelFallbackProvenance(sessionEntry);
		const hasLegacyAutoFallbackOverrideWithoutOrigin = hasStoredOverride && hasLegacyAutoFallbackWithoutOrigin(sessionEntry);
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
			const entry = sessionEntry;
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
					await persistSessionEntry({
						sessionStore,
						sessionKey,
						storePath,
						entry
					});
				}
			}
			if (repairProviderWrappedModelOverride({
				entry,
				defaultProvider,
				defaultModel
			}).updated) await persistSessionEntry({
				sessionStore,
				sessionKey,
				storePath,
				entry
			});
			const overrideProvider = sessionEntry.providerOverride?.trim() || defaultProvider;
			const overrideModel = sessionEntry.modelOverride?.trim();
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
					if (updated) await persistSessionEntry({
						sessionStore,
						sessionKey,
						storePath,
						entry
					});
				}
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
		if (!resolvedThinkLevel) resolvedThinkLevel = normalizeThinkLevel(resolveAgentConfig(cfg, sessionAgentId)?.thinkingDefault) ?? resolveThinkingDefault({
			cfg,
			provider,
			model,
			catalog: thinkingCatalog
		});
		if (!isThinkingLevelSupported({
			provider,
			model,
			level: resolvedThinkLevel,
			catalog: thinkingCatalog
		})) {
			const explicitThink = Boolean(thinkOnce || thinkOverride);
			const isSubagentSpawnRun = isSubagentLane && isSubagentSessionKey(sessionKey);
			if (explicitThink && !isSubagentSpawnRun) throw new Error(`Thinking level "${resolvedThinkLevel}" is not supported for ${provider}/${model}. Use one of: ${formatThinkingLevels(provider, model, ", ", thinkingCatalog)}.`);
			const fallbackThinkLevel = resolveSupportedThinkingLevel({
				provider,
				model,
				level: resolvedThinkLevel,
				catalog: thinkingCatalog
			});
			if (fallbackThinkLevel !== resolvedThinkLevel) resolvedThinkLevel = fallbackThinkLevel;
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
			if (stopReason && stopReason !== "end_turn") console.error(`[agent] run ${runId} ended with stopReason=${stopReason}`);
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
					...resolveAgentRunAbortLifecycleFields(opts.abortSignal)
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
					return attemptExecutionRuntime.runAgentAttempt({
						providerOverride,
						modelOverride,
						modelFallbacksOverride: effectiveFallbacksOverride,
						originalProvider: provider,
						cfg,
						sessionEntry: attemptSessionEntry,
						sessionId,
						sessionKey,
						sessionAgentId,
						sessionFile: attemptSessionFile,
						workspaceDir,
						cwd,
						body,
						isFallbackRetry,
						resolvedThinkLevel,
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
						suppressPromptPersistenceOnRetry: opts.suppressPromptPersistence === true || isFallbackRetry && attemptLifecycleState.currentTurnUserMessagePersisted,
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
					sessionEntry.authProfileOverride = err.authProfileId;
					sessionEntry.authProfileOverrideSource = err.authProfileId ? err.authProfileIdSource : void 0;
					sessionEntry.authProfileOverrideCompactionCount = void 0;
				}
				if (storedModelOverride || err.model !== previousModel || err.provider !== previousProvider) {
					storedModelOverride = err.model;
					storedModelOverrideSource = "user";
				}
				attemptLifecycleState.lifecycleEnded = false;
				log.info(`Live session model switch in subagent run ${runId}: switching to ${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)}`);
				continue;
			}
			if (!attemptLifecycleState.lifecycleEnded) emitAgentEvent({
				runId,
				lifecycleGeneration,
				stream: "lifecycle",
				data: {
					phase: "error",
					startedAt,
					endedAt: Date.now(),
					error: err instanceof Error ? err.message : "Agent run failed",
					...resolveAgentRunAbortLifecycleFields(opts.abortSignal)
				}
			});
			await fallbackTrajectoryRecorder?.flush();
			throw err;
		}
		try {
			await fallbackTrajectoryRecorder?.flush();
			const rotatedSessionFile = result.meta.agentMeta?.sessionFile;
			const effectiveSessionId = rotatedSessionFile ? result.meta.agentMeta?.sessionId ?? sessionId : sessionId;
			const effectiveSessionFile = rotatedSessionFile ?? attemptSessionFile;
			if (sessionStore && sessionKey && !suppressVisibleSessionEffects) {
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
					touchInteraction: opts.bootstrapContextRunKind !== "cron" && opts.bootstrapContextRunKind !== "heartbeat" && !opts.internalEvents?.length,
					preserveRuntimeModel: fallbackExhausted || opts.bootstrapContextRunKind === "heartbeat" || preserveUserFacingSessionModelState,
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
						embeddedAssistantGapFill
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
					thinkLevel: resolvedThinkLevel,
					extraSystemPrompt: opts.extraSystemPrompt
				});
			}
			const payloads = result.payloads ?? [];
			let pendingFinalDeliveryTextForThisRun;
			if (opts.deliver === true && sessionStore && sessionKey && !suppressVisibleSessionEffects && !sessionReboundDuringRun && payloads.length > 0 && !isSubagentSessionKey(sessionKey)) {
				const now = Date.now();
				const combinedPayload = sanitizePendingFinalDeliveryText(payloads.map((p) => typeof p.text === "string" ? p.text : "").filter(Boolean).join("\n\n"));
				pendingFinalDeliveryTextForThisRun = combinedPayload || void 0;
				if (combinedPayload) sessionEntry = await persistSessionEntry({
					sessionStore,
					sessionKey,
					storePath,
					entry: {
						...sessionStore[sessionKey] ?? sessionEntry,
						pendingFinalDelivery: true,
						pendingFinalDeliveryText: combinedPayload,
						pendingFinalDeliveryContext: currentRunDeliveryContext,
						pendingFinalDeliveryCreatedAt: now,
						updatedAt: now
					},
					shouldPersist: (current) => shouldPersistCurrentRunSessionCleanup(current, sessionId)
				}) ?? sessionEntry;
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
				if (deliveryResult?.deliverySucceeded === true || noPendingTextForThisRun) sessionEntry = await persistSessionEntry({
					sessionStore,
					sessionKey,
					storePath,
					entry: clearPendingFinalDeliveryFields(entry, Date.now()),
					shouldPersist: (current) => shouldPersistCurrentRunSessionCleanup(current, sessionId)
				}) ?? sessionEntry;
			}
			if (fallbackExhausted || resolveLifecycleResultError(result, false)) emitLifecycleResultError(result, fallbackExhausted);
			else emitLifecycleEnd(result);
			return deliveryResult;
		} catch (error) {
			emitLifecyclePostTurnError(error);
			throw error;
		}
	} finally {
		if (!sessionReboundDuringRun && trackedRestartRecoveryDeliveryContext && sessionStore && sessionKey) try {
			const entry = sessionStore[sessionKey] ?? sessionEntry;
			if (entry?.restartRecoveryDeliveryContext && entry.restartRecoveryDeliveryRunId === runId) sessionEntry = await persistSessionEntry({
				sessionStore,
				sessionKey,
				storePath,
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
/** Runs an agent turn from an inbound channel/gateway ingress context. */
async function agentCommandFromIngress(opts, runtime = defaultRuntime, deps) {
	if (typeof opts.allowModelOverride !== "boolean") throw new Error("allowModelOverride must be explicitly set for ingress agent runs.");
	const lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(opts.runId ?? "");
	return await withAgentRunLifecycleGeneration(lifecycleGeneration, () => agentCommandInternal({
		...opts,
		lifecycleGeneration,
		senderIsOwner: opts.senderIsOwner === true
	}, runtime, deps));
}
const testing = {
	resolveAgentRuntimeConfig,
	prepareAgentCommandExecution,
	resolveExplicitAgentCommandSessionKey
};
//#endregion
export { agentCommandFromIngress as n, testing as r, agentCommand as t };
