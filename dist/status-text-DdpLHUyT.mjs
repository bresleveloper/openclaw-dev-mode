import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { A as withTimeout } from "./fs-safe-6Z4UiMS4.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { D as resolveProjectedAgentRunProgressState } from "./agent-run-registry-gmaPgO-n.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { l as toAgentModelListLike } from "./model-input-CeM8o97s.mjs";
import { n as hasSessionAutoModelFallbackProvenance } from "./model-override-provenance-ByJqxWxk.mjs";
import { h as resolveSessionAgentId, u as resolveAgentModelFallbacksOverride } from "./agent-scope-DXrnO3F4.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BJKolYfz.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Bm7d8DH8.mjs";
import { n as preparePhysicalSessionStorePath } from "./session-store-path-BQkYPc4_.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BGDhC4_W.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { t as formatTokenCount } from "./token-format-DW77OPWV.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { r as listRegisteredAgentHarnesses } from "./registry-BDZ8eM01.mjs";
import { c as resolveAgentHarnessAutoSelectionHint } from "./support-CqB31PZB.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { m as resolveActiveProviderThinkingProfile } from "./thinking-BCNoGfZ5.mjs";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import { t as areRuntimeModelRefsEquivalent, u as shouldPreferActiveRuntimeAliasAuthLabel } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
import { o as selectModelCatalogRuntimeEntry } from "./model-catalog-view-UkLRAY5C.mjs";
import { s as getPreparedModelRuntimeAuthStore } from "./prepared-model-runtime-auth-xGBK6WuU.mjs";
import { a as formatUsd } from "./usage-format-DT58obO2.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
import { i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import { i as resolveSelectedAndActiveModel, n as readSessionFallbackModelAsync } from "./session-fallback-model-079vSBeH.mjs";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-Bf7HNrTn.mjs";
import { i as resolveSandboxRuntimeStatusAsync } from "./runtime-status-DWm-5zUj.mjs";
import { n as resolveSessionLifecycleTimestampsAsync } from "./lifecycle-read-BY2ebrMY.mjs";
import { t as formatDurationCompact } from "./format-duration-CyyGVUjR.mjs";
import { c as resolveUsageProviderId } from "./provider-usage.shared-CksXGFVr.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./display-D4lohsyV.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { t as normalizeGroupActivation } from "./group-activation-D-hOhHZQ.mjs";
import { n as prepareTtsPreferences } from "./tts-preferences-Bp6AU2gl.mjs";
import { o as resolveInternalSessionKey, s as resolveMainSessionAlias } from "./sessions-resolution-CQXReb8R.mjs";
import "./sessions-helpers-DCz0gP72.mjs";
import "./sandbox-4O9XYRNc.mjs";
import { n as prepareModelCatalogDecisions } from "./model-catalog-decisions-B-_jc7Z2.mjs";
import { n as resolveModelAuthLabelAsync } from "./model-auth-label-Ds3jL8Jm.mjs";
import { t as formatModelEndpointUrl } from "./status-model-endpoint-kIhY7DXc.mjs";
import { r as formatCompactPluginHealthLine } from "./status-plugin-health-BgNllFFR.mjs";
import { n as formatUsageWindowSummary } from "./provider-usage.format-L6iA6HgQ.mjs";
import { t as loadProviderUsageSummary } from "./provider-usage.load-CQIt9jHT.mjs";
import "./provider-usage-DtzBR2iU.mjs";
import { i as shouldUseCodexSyntheticUsageForRuntime, r as resolveUsageCredentialType, t as buildCodexSyntheticUsageAuth } from "./codex-synthetic-usage-DCAKKwoG.mjs";
import { i as formatMissingCostEntries } from "./session-cost-usage-totals-Blmg-HFT.mjs";
import { r as loadSessionCostSummariesFromCache } from "./session-cost-usage-cache-runtime-CYTPw1GD.mjs";
import "./session-cost-usage-DW7QuRUA.mjs";
import os from "node:os";
//#region src/status/status-model-auth.ts
/** Status borrows the account and route selected by the prepared model owner. */
function createStatusModelResolver(params) {
	const { owner, sessionEntry } = params;
	const authStore = owner && getPreparedModelRuntimeAuthStore(owner);
	const preparation = owner && authStore ? prepareModelCatalogDecisions({
		cfg: owner.config,
		agentId: params.agentId,
		agentDir: owner.agentDir,
		workspaceDir: owner.workspaceDir,
		snapshot: owner.modelCatalog,
		metadataSnapshot: owner.metadataSnapshot,
		preparedAuthStore: authStore,
		preparedRuntimeAuthModes: owner.authModes,
		pluginRegistry: owner.pluginRegistry,
		observationConfig: owner.observationConfig,
		isCurrent: owner.isCurrent,
		preferredProfileId: sessionEntry?.authProfileOverride,
		pinnedProfileId: sessionEntry?.authProfileOverrideSource === "user" ? sessionEntry.authProfileOverride : void 0,
		profileProvider: sessionEntry?.providerOverride ?? sessionEntry?.modelProvider
	}) : void 0;
	return async (selection) => {
		const decisions = await preparation;
		const { provider, model, runtimeId } = selection;
		const usesHostAuth = !owner || !runtimeId || runtimeId === "openclaw" || runtimeId === "auto" || provider === runtimeId;
		const hasAuthOverride = Object.hasOwn(selection, "authLabelOverride");
		const authLabel = hasAuthOverride ? selection.authLabelOverride : usesHostAuth ? await resolveModelAuthLabelAsync({
			provider,
			acceptedProviderIds: selection.acceptedProviderIds,
			cfg: params.cfg,
			sessionEntry,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			includeExternalProfiles: false,
			authStore
		}) : "unknown";
		if (!decisions?.isCurrent() || !authStore) return { authLabel };
		const entry = findModelInCatalog(decisions.snapshot.entries, provider, model);
		const variants = decisions.snapshot.routeVariants.filter((row) => row.provider === provider && row.id === model);
		const host = decisions.evaluateEntry(entry ?? {
			provider,
			id: model
		}, variants.length ? variants : entry ? [entry] : void 0, runtimeId);
		const evaluation = entry ? decisions.evaluateNative(entry, host, runtimeId) : host;
		if (!decisions.isCurrent() || evaluation.availability !== true) return { authLabel };
		if (evaluation.runtimeAuth && evaluation.runtimeAuth.id !== runtimeId) return { authLabel };
		const endpoint = evaluation.selectedRoute?.baseUrl ? formatModelEndpointUrl(evaluation.selectedRoute.baseUrl) : void 0;
		if (hasAuthOverride || usesHostAuth && !evaluation.selectedCredential) return {
			authLabel,
			endpoint
		};
		const mode = evaluation.selectedAuthMode === "api_key" ? "api-key" : evaluation.selectedAuthMode;
		const profileId = evaluation.selectedProfileId;
		const label = profileId ? isUserModelAuthProfileId(profileId) ? "personal account" : resolveAuthProfileDisplayLabel({
			cfg: params.cfg,
			store: authStore,
			profileId
		}) : evaluation.runtimeAuth ? runtimeId : evaluation.evidence === "provider-config" ? "models.json" : evaluation.evidence === "environment" ? "environment" : void 0;
		return {
			authLabel: (mode ?? (evaluation.runtimeAuth ? "native" : "unknown")) + (label ? ` (${label})` : ""),
			endpoint
		};
	};
}
//#endregion
//#region src/status/status-runtime-lines.ts
function buildStatusUptimeValue() {
	const format = (ms) => formatDurationCompact(ms, { spaced: true }) ?? "0s";
	const gatewayMs = Math.max(0, Math.round(process.uptime() * 1e3));
	const systemMs = Math.max(0, Math.round(os.uptime() * 1e3));
	return `gateway ${format(gatewayMs)} · system ${format(systemMs)}`;
}
async function appendSessionCostLine(usageLine, cfg, agentId, sessionEntry, storePath) {
	const sessionId = sessionEntry?.sessionId?.trim();
	if (!sessionId) return usageLine;
	let sessionFile;
	try {
		sessionFile = formatSqliteSessionFileMarker({
			sessionId,
			agentId,
			storePath: await preparePhysicalSessionStorePath({
				agentId,
				...storePath ? { storePath } : {}
			}, cfg)
		});
	} catch {
		return usageLine;
	}
	const now = Date.now();
	const date = new Date(now);
	const startMs = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	try {
		const loaded = await withTimeout(loadSessionCostSummariesFromCache({
			sessions: [{
				sessionId,
				sessionFile
			}],
			config: cfg,
			agentId,
			startMs,
			endMs: now,
			dayBucket: {
				mode: "utc-offset",
				utcOffsetMinutes: -date.getTimezoneOffset()
			},
			requestRefresh: false
		}), 3500, { message: "session cost timeout" });
		const summary = loaded.cacheStatus.status === "fresh" ? loaded.summaries[0] : null;
		if (!summary) return usageLine;
		const cost = summary.missingCostEntries > 0 ? `missing cost: ${formatMissingCostEntries(summary)}` : formatUsd(summary.totalCost);
		const tokens = summary.usageReport?.state === "unavailable" ? `usage incomplete · ${formatTokenCount(summary.totalTokens)} known tokens` : `${formatTokenCount(summary.totalTokens)} tok`;
		return [usageLine, `💵 ${cost ? `${cost} · ` : ""}${tokens} (today)`].filter(Boolean).join("\n");
	} catch {
		return usageLine;
	}
}
//#endregion
//#region src/status/status-text.ts
const USAGE_OAUTH_ONLY_PROVIDERS = /* @__PURE__ */ new Set([
	"anthropic",
	"github-copilot",
	"google-gemini-cli",
	"openai"
]);
const loadStatusMessageRuntime = createLazyPromise(() => import("./status-message.runtime.js").then((module) => module.loadStatusMessageRuntimeModule()));
const loadAgentThinkingRuntime = createLazyPromise(() => import("./thinking-runtime-CMpQCA7H.mjs"));
const loadThinkingLevelRuntime = createLazyPromise(() => import("./thinking-DzqF5_vl.mjs"));
const loadStatusSubagentsRuntime = createLazyPromise(() => import("./status-subagents.runtime.js"));
const loadStatusQueueRuntime = createLazyPromise(() => import("./status-queue.runtime.js"));
const loadStatusPluginHealthRuntime = createLazyPromise(() => import("./status-plugin-health.runtime.js"));
async function resolveCodexSyntheticUsageAuthProfileId(params) {
	const normalizedProfileId = params.profileId?.trim();
	if (!normalizedProfileId) return;
	try {
		const credential = (await ensureAuthProfileStoreAsync(params.agentDir, {
			allowKeychainPrompt: false,
			config: params.cfg,
			readOnly: true,
			syncExternalCli: false
		})).profiles[normalizedProfileId];
		if (!credential) return;
		return normalizeOptionalLowercaseString(credential.provider) === "openai" ? normalizedProfileId : void 0;
	} catch {
		return;
	}
}
async function resolveStatusHarnessId(params) {
	try {
		const sessionRuntime = resolveSessionRuntimeOverrideForProvider({
			provider: params.provider,
			entry: params.sessionEntry,
			cfg: params.cfg
		});
		const configuredRuntime = resolveAgentHarnessPolicy({
			provider: params.provider,
			modelId: params.model,
			config: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey
		}).runtime;
		const runtime = sessionRuntime ?? configuredRuntime;
		if (runtime !== "auto") return normalizeOptionalLowercaseString(runtime) || void 0;
		if (listRegisteredAgentHarnesses().every(({ harness }) => resolveAgentHarnessAutoSelectionHint({
			harness,
			provider: params.provider
		}) !== void 0)) return "openclaw";
		const { resolveEffectiveAgentRuntime } = await loadAgentThinkingRuntime();
		const id = resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			provider: params.provider,
			modelId: params.model,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionEntry: params.sessionEntry
		});
		return normalizeOptionalLowercaseString(id) || void 0;
	} catch {
		return;
	}
}
function resolveStatusRuntimeProvider(params) {
	const harness = normalizeOptionalLowercaseString(params.effectiveHarness);
	const provider = normalizeOptionalLowercaseString(params.provider);
	if (harness === "codex" && (provider === "openai" || provider === "codex")) return "openai";
	if (harness === "claude-cli" && provider === "anthropic") return "claude-cli";
	return params.provider;
}
async function resolveRuntimePluginHealthLine() {
	try {
		const { collectRuntimePluginHealthSnapshot } = await loadStatusPluginHealthRuntime();
		return formatCompactPluginHealthLine(await collectRuntimePluginHealthSnapshot());
	} catch {
		return "⚠️ Plugins: health unavailable";
	}
}
async function buildStatusText(params) {
	return (await buildStatusReplyParts(params)).text;
}
async function buildStatusReplyParts(params) {
	const { cfg, sessionEntry, sessionKey, parentSessionKey, sessionScope, storePath, statusChannel, provider, model, thinkingCatalog, resolvedThinkLevel, resolvedFastMode, resolvedVerboseLevel, resolvedReasoningLevel, resolvedElevatedLevel, resolveDefaultThinkingLevel, isGroup, defaultGroupActivation } = params;
	const statusAgentId = resolveSessionAgentId({
		sessionKey,
		config: cfg,
		agentId: params.agentId
	});
	const statusAgentDir = resolveAgentDir(cfg, statusAgentId);
	const statusWorkspaceDir = params.workspaceDir ?? sessionEntry?.spawnedWorkspaceDir ?? resolveAgentWorkspaceDir(cfg, statusAgentId);
	const selectedProvider = sessionEntry?.providerOverride?.trim() ?? provider;
	const selectedModel = sessionEntry?.modelOverride?.trim() ?? model;
	const modelParams = {
		selectedProvider,
		selectedModel,
		sessionEntry,
		parseSelectedProvider: Boolean(sessionEntry?.modelOverride?.trim() && !sessionEntry?.providerOverride?.trim())
	};
	const activeModel = resolveProjectedAgentRunProgressState({
		agentId: statusAgentId,
		sessionId: sessionEntry?.sessionId,
		sessionKeys: sessionKey ? [sessionKey] : []
	}) === void 0 ? await readSessionFallbackModelAsync({
		...modelParams,
		config: cfg,
		sessionScope: {
			agentId: statusAgentId,
			sessionKey,
			storePath
		}
	}) : void 0;
	const modelRefs = resolveSelectedAndActiveModel({
		...modelParams,
		sessionEntry: activeModel ?? sessionEntry
	});
	const selectedLookupProvider = modelRefs.selected.provider || selectedProvider || provider;
	const selectedLookupModel = modelRefs.selected.model || selectedModel || model;
	const effectiveHarness = params.resolvedHarness ?? await resolveStatusHarnessId({
		cfg,
		provider: selectedLookupProvider,
		model: selectedLookupModel,
		agentId: statusAgentId,
		sessionKey,
		sessionEntry
	});
	const { getPreparedModelCatalogOwnerSnapshot, materializePreparedModelCatalogOwner } = await import("./prepared-model-catalog-CCWmZ0HZ.mjs");
	const preparedOwner = getPreparedModelCatalogOwnerSnapshot({
		config: cfg,
		agentId: statusAgentId,
		agentDir: statusAgentDir,
		workspaceDir: statusWorkspaceDir,
		readOnly: true
	});
	const owner = preparedOwner ? materializePreparedModelCatalogOwner(preparedOwner) : void 0;
	const resolveModel = createStatusModelResolver({
		cfg,
		agentId: statusAgentId,
		agentDir: statusAgentDir,
		workspaceDir: statusWorkspaceDir,
		sessionEntry,
		owner
	});
	const selectedStatusProvider = resolveStatusRuntimeProvider({
		provider: selectedLookupProvider,
		effectiveHarness
	});
	const selectedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: selectedLookupProvider,
		harnessRuntime: effectiveHarness,
		config: cfg
	});
	const activeProvider = modelRefs.active.provider || provider;
	const activeStatusProvider = resolveStatusRuntimeProvider({
		provider: activeProvider,
		effectiveHarness
	});
	const activeAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: activeProvider,
		harnessRuntime: effectiveHarness,
		config: cfg
	});
	const selectedResolution = await resolveModel({
		provider: selectedStatusProvider,
		model: selectedLookupModel,
		runtimeId: effectiveHarness,
		acceptedProviderIds: selectedAuthProviders,
		...Object.hasOwn(params, "modelAuthOverride") ? { authLabelOverride: params.modelAuthOverride } : {}
	});
	let selectedModelAuth = selectedResolution.authLabel;
	const activeModelAuth = Object.hasOwn(params, "activeModelAuthOverride") ? params.activeModelAuthOverride : modelRefs.activeDiffers ? (await resolveModel({
		provider: activeStatusProvider,
		model: modelRefs.active.model || model,
		runtimeId: effectiveHarness,
		acceptedProviderIds: activeAuthProviders
	})).authLabel : selectedModelAuth;
	const runtimeAliasModelEquivalent = areRuntimeModelRefsEquivalent(modelRefs.selected.label, modelRefs.active.label, { config: cfg });
	const fallbackState = resolveActiveFallbackState({
		selectedModelRef: modelRefs.selected.label || "unknown",
		activeModelRef: modelRefs.active.label || "unknown",
		config: cfg,
		state: sessionEntry
	});
	if (shouldPreferActiveRuntimeAliasAuthLabel({
		runtimeAliasModelEquivalent,
		selectedAuthLabel: selectedModelAuth,
		activeAuthLabel: activeModelAuth
	})) selectedModelAuth = activeModelAuth;
	const activeRuntimeIsAuthoritative = !modelRefs.activeDiffers || fallbackState.active || hasSessionAutoModelFallbackProvenance(sessionEntry) || runtimeAliasModelEquivalent;
	const usageAuthLabel = activeRuntimeIsAuthoritative ? activeModelAuth : selectedModelAuth;
	const usageStatusProvider = activeRuntimeIsAuthoritative ? activeStatusProvider : selectedStatusProvider;
	const usageProvider = activeRuntimeIsAuthoritative ? activeProvider : selectedLookupProvider;
	const selectedUsageCredentialType = resolveUsageCredentialType(usageAuthLabel);
	const useCodexSyntheticUsage = selectedUsageCredentialType !== "api_key" && shouldUseCodexSyntheticUsageForRuntime({
		provider: usageStatusProvider,
		effectiveHarness,
		sessionHarnessId: sessionEntry?.agentHarnessId
	});
	const codexUsageAuthProfileId = useCodexSyntheticUsage ? await resolveCodexSyntheticUsageAuthProfileId({
		profileId: sessionEntry?.authProfileOverride,
		cfg,
		agentDir: statusAgentDir
	}) : void 0;
	const usageCredentialType = useCodexSyntheticUsage ? "token" : selectedUsageCredentialType;
	const currentUsageProvider = resolveUsageProviderId(usageStatusProvider, { credentialType: usageCredentialType }) ?? resolveUsageProviderId(usageProvider, { credentialType: usageCredentialType });
	let usageLine = null;
	const normalizedUsageAuth = normalizeOptionalLowercaseString(usageAuthLabel);
	if (currentUsageProvider && (!USAGE_OAUTH_ONLY_PROVIDERS.has(currentUsageProvider) || usageCredentialType === "oauth" || usageCredentialType === "token" || normalizedUsageAuth?.startsWith("oauth") || normalizedUsageAuth?.startsWith("token"))) try {
		const usageSummaryTimeoutMs = useCodexSyntheticUsage ? 8e3 : 3500;
		const usageEntry = (await withTimeout(loadProviderUsageSummary({
			timeoutMs: usageSummaryTimeoutMs,
			providers: [currentUsageProvider],
			agentDir: statusAgentDir,
			workspaceDir: statusWorkspaceDir,
			config: cfg,
			auth: useCodexSyntheticUsage ? [buildCodexSyntheticUsageAuth({ authProfileId: codexUsageAuthProfileId })] : void 0
		}), usageSummaryTimeoutMs, { message: "usage summary timeout" })).providers[0];
		if (usageEntry && !usageEntry.error && (usageEntry.windows.length > 0 || Boolean(usageEntry.billing?.length) || Boolean(usageEntry.summary?.trim()))) {
			const summaryLine = formatUsageWindowSummary(usageEntry, {
				now: Date.now(),
				maxWindows: 2,
				includeResets: true
			});
			if (summaryLine) usageLine = `📊 Usage: ${summaryLine}`;
		}
	} catch {
		usageLine = null;
	}
	usageLine = await appendSessionCostLine(usageLine, cfg, statusAgentId, sessionEntry, storePath);
	const { getFollowupQueueDepth, resolveQueueSettings } = await loadStatusQueueRuntime();
	const queueSettings = resolveQueueSettings({
		cfg,
		channel: statusChannel,
		sessionEntry
	});
	const queueKey = sessionKey ?? sessionEntry?.sessionId;
	const queueDepth = queueKey ? getFollowupQueueDepth(queueKey) : 0;
	const queueOverrides = Boolean(sessionEntry?.queueDebounceMs ?? sessionEntry?.queueCap ?? sessionEntry?.queueDrop);
	let subagentsLine;
	if (sessionKey) {
		const { alias } = resolveMainSessionAlias(cfg);
		const requesterKey = resolveInternalSessionKey({
			key: sessionKey,
			alias
		});
		const { buildControlledSubagentRunsReadContext, buildSubagentsStatusLine } = await loadStatusSubagentsRuntime();
		subagentsLine = buildSubagentsStatusLine({
			context: await buildControlledSubagentRunsReadContext(requesterKey, statusAgentId, cfg),
			verboseEnabled: resolvedVerboseLevel && resolvedVerboseLevel !== "off"
		});
	}
	const groupActivation = isGroup ? normalizeGroupActivation(sessionEntry?.groupActivation) ?? defaultGroupActivation() : void 0;
	const agentDefaults = cfg.agents?.defaults ?? {};
	const agentConfig = resolveAgentConfig(cfg, statusAgentId);
	const effectiveFastMode = resolvedFastMode ?? resolveFastModeState({
		cfg,
		provider: selectedLookupProvider,
		model: selectedLookupModel,
		agentId: statusAgentId,
		sessionEntry
	}).mode;
	const agentFallbacksOverride = resolveAgentModelFallbacksOverride(cfg, statusAgentId);
	const configuredDefaultRef = resolveDefaultModelForAgent({
		cfg,
		agentId: statusAgentId,
		allowPluginNormalization: false
	});
	const configuredDefaultModelLabel = `${configuredDefaultRef.provider}/${configuredDefaultRef.model}`;
	const pluginHealthLine = Object.hasOwn(params, "pluginHealthLineOverride") ? params.pluginHealthLineOverride : await resolveRuntimePluginHealthLine();
	let channelFeatureLine;
	if (normalizeOptionalLowercaseString(statusChannel) === "telegram") {
		const telegramConfig = cfg.channels?.telegram;
		const accountId = normalizeAccountId(params.statusAccountId ?? deliveryContextFromSession(sessionEntry)?.accountId ?? sessionDeliveryOrigin(sessionEntry)?.accountId ?? telegramConfig?.defaultAccount);
		const accountConfig = resolveNormalizedAccountEntry(telegramConfig?.accounts, accountId, normalizeAccountId);
		channelFeatureLine = (accountConfig?.richMessages ?? telegramConfig?.richMessages) === true ? "Telegram rich messages: on · Bot API 10.3 sendRichMessage enabled" : accountConfig?.richMessages === false ? "Telegram rich messages: off · enable richMessages for this Telegram account" : "Telegram rich messages: off · set channels.telegram.richMessages=true for tables/details/rich media";
	}
	const { buildStatusMessageParts } = await loadStatusMessageRuntime();
	const configuredThinkingDefault = resolveConfiguredThinkingDefaultCore({
		cfg,
		agentId: statusAgentId,
		provider: selectedLookupProvider,
		model: selectedLookupModel
	});
	const catalog = owner ? owner.isCurrent() ? owner.modelCatalog : void 0 : void 0;
	const contextCatalog = catalog ? catalog.entries.map((entry) => selectModelCatalogRuntimeEntry({
		entry,
		routeVariants: catalog.routeVariants,
		runtimeId: effectiveHarness ?? "openclaw",
		allowApiFallback: false
	}).entry) : owner ? [] : (thinkingCatalog ?? []).filter((entry) => entry.nativeRuntime ? entry.nativeRuntime === effectiveHarness : [
		"openclaw",
		"auto",
		entry.provider
	].includes(effectiveHarness ?? "openclaw"));
	const selectedCatalogEntry = findModelInCatalog(contextCatalog, selectedLookupProvider, selectedLookupModel);
	const initialActiveCatalogEntry = findModelInCatalog(contextCatalog, activeProvider, modelRefs.active.model || model);
	const requestedThinkLevel = resolvedThinkLevel ?? normalizeThinkLevel(sessionEntry?.thinkingLevel) ?? configuredThinkingDefault ?? await resolveDefaultThinkingLevel({
		provider: selectedLookupProvider,
		model: selectedLookupModel,
		agentRuntime: effectiveHarness
	}) ?? "off";
	const activeThinkingProfile = requestedThinkLevel === "off" ? resolveActiveProviderThinkingProfile({
		provider: selectedLookupProvider,
		context: {
			provider: selectedLookupProvider,
			modelId: selectedLookupModel,
			agentRuntime: effectiveHarness
		}
	}) : void 0;
	const activeProfileSupportsOff = activeThinkingProfile?.levels.some((level) => level.id === "off");
	const effectiveThinkLevel = requestedThinkLevel === "off" && (activeThinkingProfile == null || activeProfileSupportsOff === true) ? "off" : (await loadThinkingLevelRuntime()).resolveSupportedThinkingLevel({
		provider: selectedLookupProvider,
		model: selectedLookupModel,
		level: requestedThinkLevel,
		catalog: thinkingCatalog,
		agentRuntime: effectiveHarness,
		providerPolicySource: normalizeOptionalLowercaseString(effectiveHarness) === "codex" && ["codex", "openai"].includes(normalizeOptionalLowercaseString(selectedLookupProvider) ?? "") ? "active-or-bundled" : "active"
	});
	const hasCommittedUsage = resolveFreshSessionTotalTokens(sessionEntry) !== void 0 && [
		sessionEntry?.inputTokens,
		sessionEntry?.outputTokens,
		sessionEntry?.cacheRead,
		sessionEntry?.cacheWrite
	].every((value) => typeof value === "number") && Boolean(sessionEntry?.model || activeModel);
	const [lifecycleTimestamps, transcriptUsage] = await Promise.all([resolveSessionLifecycleTimestampsAsync({
		entry: sessionEntry,
		agentId: statusAgentId,
		sessionKey,
		storePath
	}), params.includeTranscriptUsage !== false && !hasCommittedUsage && sessionEntry?.sessionId ? import("./session-transcript-usage-MIZNDws-.mjs").then(({ readRecentSessionUsageFromTranscriptAsync }) => readRecentSessionUsageFromTranscriptAsync({
		agentId: statusAgentId,
		sessionEntry,
		sessionId: sessionEntry.sessionId,
		sessionKey,
		storePath
	}, 262144)).catch(() => null) : void 0]);
	return buildStatusMessageParts({
		config: cfg,
		preparedSandboxRuntime: await resolveSandboxRuntimeStatusAsync({
			cfg,
			sessionKey,
			agentId: statusAgentId,
			preparedSessionEntry: sessionEntry
		}),
		preparedTtsPreferences: params.preparedTtsPreferences ?? await prepareTtsPreferences(),
		agent: {
			...agentDefaults,
			model: {
				...toAgentModelListLike(agentDefaults.model),
				primary: params.primaryModelLabelOverride ?? `${provider}/${model}`,
				...agentFallbacksOverride === void 0 ? {} : { fallbacks: agentFallbacksOverride }
			},
			thinkingDefault: configuredThinkingDefault,
			verboseDefault: agentDefaults.verboseDefault,
			reasoningDefault: agentConfig?.reasoningDefault ?? agentDefaults.reasoningDefault,
			elevatedDefault: agentDefaults.elevatedDefault
		},
		agentId: statusAgentId,
		configuredDefaultModelLabel,
		modelRefs,
		activeModel,
		selectedContextWindow: selectedCatalogEntry?.contextWindow,
		selectedContextTokens: selectedCatalogEntry?.contextTokens,
		thinkingCatalog: contextCatalog,
		runtimeContextProvider: activeRuntimeIsAuthoritative ? activeStatusProvider : void 0,
		runtimeContextTokens: initialActiveCatalogEntry?.contextTokens,
		sessionEntry,
		sessionKey,
		parentSessionKey,
		sessionScope,
		sessionStartedAt: lifecycleTimestamps.sessionStartedAt,
		groupActivation,
		resolvedThink: effectiveThinkLevel,
		requestedThink: requestedThinkLevel,
		resolvedFast: effectiveFastMode,
		resolvedHarness: effectiveHarness,
		resolvedVerbose: resolvedVerboseLevel,
		resolvedReasoning: resolvedReasoningLevel,
		resolvedElevated: resolvedElevatedLevel,
		modelAuth: selectedModelAuth,
		selectedEndpoint: selectedResolution.endpoint,
		activeModelAuth,
		uptimeValue: buildStatusUptimeValue(),
		usageLine: usageLine ?? void 0,
		queue: {
			mode: queueSettings.mode,
			depth: queueDepth,
			debounceMs: queueSettings.debounceMs,
			cap: queueSettings.cap,
			dropPolicy: queueSettings.dropPolicy,
			showDetails: queueOverrides
		},
		subagentsLine,
		pluginHealthLine,
		channelFeatureLine,
		mediaDecisions: params.mediaDecisions,
		transcriptUsage
	});
}
//#endregion
export { buildStatusText as n, buildStatusReplyParts as t };
