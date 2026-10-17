import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { l as toAgentModelListLike } from "./model-input-C9K4a_6k.mjs";
import { T as hasSessionAutoModelFallbackProvenance, g as resolveSessionAgentId, u as resolveAgentModelFallbacksOverride } from "./agent-scope-CG17uXFn.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { c as normalizeThinkLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-92B-lj2w.mjs";
import { t as formatDurationCompact } from "./format-duration-BIQQYTeV.mjs";
import { v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-Rdb47msF.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-Qx0DZ2Si.mjs";
import { s as getPreparedModelRuntimeAuthStore } from "./prepared-model-runtime-auth-Dn7HF9Vu.mjs";
import { m as resolveActiveProviderThinkingProfile } from "./thinking-NbdrO8vA.mjs";
import { r as listRegisteredAgentHarnesses } from "./registry-BrXrewXj.mjs";
import { c as resolveUsageProviderId } from "./provider-usage.shared-B2Q7uCr7.mjs";
import "./model-selection-D3_rVb38.mjs";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-CZnoMXD6.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-BIPn3mmc.mjs";
import { u as resolveAgentHarnessAutoSelectionHint } from "./availability-DXC5lyRk.mjs";
import { c as shouldPreferActiveRuntimeAliasAuthLabel, t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-B5N-I0ib.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-rcNVygEk.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { p as preparePhysicalSessionStorePath } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { t as formatTokenCount } from "./token-format-BRba24iW.mjs";
import { a as formatUsd } from "./usage-format-CmKsaFRe.mjs";
import { t as normalizeGroupActivation } from "./group-activation-C9UsJ0Nq.mjs";
import { c as waitForContextWindowCacheLoad } from "./context-DtziOKiU.mjs";
import { t as resolveFastModeState } from "./fast-mode-CdiysUl0.mjs";
import { r as resolveSelectedAndActiveModel, t as readSessionFallbackModel } from "./session-fallback-model-GrIUyRG6.mjs";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-CCOA5IKG.mjs";
import { a as resolveInternalSessionKey, o as resolveMainSessionAlias } from "./sessions-resolution-xzpaoE7C.mjs";
import "./sessions-helpers-CULwdUYq.mjs";
import { t as createModelCatalogDecisions } from "./model-catalog-decisions-DtL7c1Jk.mjs";
import { t as resolveModelAuthLabel } from "./model-auth-label-Ch2WjZIZ.mjs";
import { t as formatModelEndpointUrl } from "./status-model-endpoint-CmP55uaA.mjs";
import { r as formatCompactPluginHealthLine } from "./status-plugin-health-D9gBz1V0.mjs";
import { n as formatUsageWindowSummary } from "./provider-usage.format-Cp0i6XBO.mjs";
import { t as loadProviderUsageSummary } from "./provider-usage.load-C0CVxGoY.mjs";
import "./provider-usage-B-7YWlab.mjs";
import { i as shouldUseCodexSyntheticUsageForRuntime, r as resolveUsageCredentialType, t as buildCodexSyntheticUsageAuth } from "./codex-synthetic-usage-Cr12F2QM.mjs";
import { i as formatMissingCostEntries } from "./session-cost-usage-totals-D4e-85ui.mjs";
import { s as loadSessionCostSummariesFromCache } from "./session-cost-usage-DcW8Cj3G.mjs";
import os from "node:os";
//#region src/status/status-model-auth.ts
/** Status borrows the account and route selected by the prepared model owner. */
function createStatusModelResolver(params) {
	const { owner, sessionEntry } = params;
	const authStore = owner && getPreparedModelRuntimeAuthStore(owner);
	const decisions = owner && authStore ? createModelCatalogDecisions({
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
		const { provider, model, runtimeId } = selection;
		const usesHostAuth = !owner || !runtimeId || runtimeId === "openclaw" || runtimeId === "auto" || provider === runtimeId;
		const hasAuthOverride = Object.hasOwn(selection, "authLabelOverride");
		const authLabel = hasAuthOverride ? selection.authLabelOverride : usesHostAuth ? resolveModelAuthLabel({
			provider,
			acceptedProviderIds: selection.acceptedProviderIds,
			cfg: params.cfg,
			sessionEntry,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			includeExternalProfiles: false
		}) : "unknown";
		if (!decisions?.isCurrent() || !authStore) return { authLabel };
		const entry = findModelInCatalog(decisions.snapshot.entries, provider, model);
		const variants = decisions.snapshot.routeVariants.filter((row) => row.provider === provider && row.id === model);
		const host = await decisions.evaluateEntry(entry ?? {
			provider,
			id: model
		}, variants.length ? variants : entry ? [entry] : void 0, runtimeId);
		const evaluation = entry ? decisions.evaluateNative(entry, host, runtimeId) : host;
		if (!decisions.isCurrent() || evaluation.availability !== true) return { authLabel };
		if (evaluation.runtimeAuth && evaluation.runtimeAuth.id !== runtimeId) return { authLabel };
		const endpoint = evaluation.selectedRoute?.baseUrl ? formatModelEndpointUrl(evaluation.selectedRoute.baseUrl) : void 0;
		if (hasAuthOverride || usesHostAuth && !evaluation.selectedRoute) return {
			authLabel,
			endpoint
		};
		const mode = evaluation.selectedAuthMode === "api_key" ? "api-key" : evaluation.selectedAuthMode;
		const profileId = evaluation.selectedProfileId;
		if (profileId) {
			const label = isUserModelAuthProfileId(profileId) ? "personal account" : resolveAuthProfileDisplayLabel({
				cfg: params.cfg,
				store: authStore,
				profileId
			});
			return {
				authLabel: mode ? mode + (label ? " (" + label + ")" : "") : "unknown",
				endpoint
			};
		}
		return {
			authLabel: evaluation.runtimeAuth ? (mode ?? "native") + " (" + runtimeId + ")" : mode ?? "unknown",
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
async function resolveSessionCostLine(params) {
	const sessionId = params.sessionEntry?.sessionId?.trim();
	if (!sessionId) return;
	let sessionFile;
	try {
		sessionFile = formatSqliteSessionFileMarker({
			sessionId,
			agentId: params.agentId,
			storePath: await preparePhysicalSessionStorePath(params, params.cfg)
		});
	} catch {
		return;
	}
	if (!sessionFile) return;
	const now = Date.now();
	const date = new Date(now);
	const startMs = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	try {
		const loaded = await withTimeout(loadSessionCostSummariesFromCache({
			sessions: [{
				sessionId,
				sessionFile
			}],
			config: params.cfg,
			agentId: params.agentId,
			startMs,
			endMs: now,
			dayBucket: {
				mode: "utc-offset",
				utcOffsetMinutes: -date.getTimezoneOffset()
			},
			requestRefresh: false
		}), 3500, { message: "session cost timeout" });
		const summary = loaded.cacheStatus.status === "fresh" ? loaded.summaries[0] : null;
		if (!summary) return;
		const cost = summary.missingCostEntries > 0 ? `missing cost: ${formatMissingCostEntries(summary)}` : formatUsd(summary.totalCost);
		return `💵 ${cost ? `${cost} · ` : ""}${formatTokenCount(summary.totalTokens)} tok (today)`;
	} catch {
		return;
	}
}
async function appendSessionCostLine(usageLine, cfg, agentId, sessionEntry, storePath) {
	const line = await resolveSessionCostLine({
		cfg,
		agentId,
		...sessionEntry ? { sessionEntry } : {},
		...storePath ? { storePath } : {}
	});
	return line ? [usageLine, line].filter(Boolean).join("\n") : usageLine;
}
//#endregion
//#region src/status/status-text.ts
const USAGE_OAUTH_ONLY_PROVIDERS = /* @__PURE__ */ new Set([
	"anthropic",
	"github-copilot",
	"google-gemini-cli",
	"openai"
]);
function resolveStatusChannelFeatureLine(params) {
	if (normalizeOptionalLowercaseString(params.statusChannel) !== "telegram") return;
	const telegramConfig = params.cfg.channels?.telegram;
	const accountId = normalizeAccountId(params.statusAccountId ?? deliveryContextFromSession(params.sessionEntry)?.accountId ?? sessionDeliveryOrigin(params.sessionEntry)?.accountId ?? telegramConfig?.defaultAccount);
	const accountConfig = resolveNormalizedAccountEntry(telegramConfig?.accounts, accountId, normalizeAccountId);
	if ((accountConfig?.richMessages ?? telegramConfig?.richMessages) === true) return "Telegram rich messages: on · Bot API 10.3 sendRichMessage enabled";
	return accountConfig?.richMessages === false ? "Telegram rich messages: off · enable richMessages for this Telegram account" : "Telegram rich messages: off · set channels.telegram.richMessages=true for tables/details/rich media";
}
const loadStatusMessageRuntime = createLazyPromise(() => import("./status-message.runtime.js").then((module) => module.loadStatusMessageRuntimeModule()));
const loadAgentThinkingRuntime = createLazyPromise(() => import("./thinking-runtime-SAEA3VWf.mjs"));
const loadThinkingLevelRuntime = createLazyPromise(() => import("./thinking-fc4TllPW.mjs"));
const loadStatusSubagentsRuntime = createLazyPromise(() => import("./status-subagents.runtime.js"));
const loadStatusQueueRuntime = createLazyPromise(() => import("./status-queue.runtime.js"));
const loadStatusPluginHealthRuntime = createLazyPromise(() => import("./status-plugin-health.runtime.js"));
function shouldLoadUsageSummary(params) {
	if (!params.provider) return false;
	if (!USAGE_OAUTH_ONLY_PROVIDERS.has(params.provider)) return true;
	const auth = normalizeOptionalLowercaseString(params.selectedModelAuth);
	return Boolean(params.credentialType === "oauth" || params.credentialType === "token" || auth?.startsWith("oauth") || auth?.startsWith("token"));
}
function resolveCodexSyntheticUsageAuthProfileId(params) {
	const normalizedProfileId = params.profileId?.trim();
	if (!normalizedProfileId) return;
	try {
		const credential = ensureAuthProfileStore(params.agentDir, {
			allowKeychainPrompt: false,
			config: params.cfg,
			readOnly: true,
			syncExternalCli: false
		}).profiles[normalizedProfileId];
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
	const { cfg, sessionEntry, sessionKey, parentSessionKey, sessionScope, storePath, statusChannel, provider, model, contextTokens, thinkingCatalog, resolvedThinkLevel, resolvedFastMode, resolvedVerboseLevel, resolvedReasoningLevel, resolvedElevatedLevel, resolveDefaultThinkingLevel, isGroup, defaultGroupActivation } = params;
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
	const activeModel = readSessionFallbackModel({
		...modelParams,
		config: cfg,
		sessionScope: {
			agentId: statusAgentId,
			sessionKey,
			storePath
		}
	});
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
	const { getPreparedModelCatalogOwnerSnapshot, materializePreparedModelCatalogOwner } = await import("./prepared-model-catalog-CdRVgew8.mjs");
	const preparedOwner = getPreparedModelCatalogOwnerSnapshot({
		config: cfg,
		agentId: statusAgentId,
		agentDir: statusAgentDir,
		workspaceDir: statusWorkspaceDir,
		readOnly: true
	});
	const resolveModel = createStatusModelResolver({
		cfg,
		agentId: statusAgentId,
		agentDir: statusAgentDir,
		workspaceDir: statusWorkspaceDir,
		sessionEntry,
		owner: preparedOwner ? materializePreparedModelCatalogOwner(preparedOwner) : void 0
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
	const codexUsageAuthProfileId = useCodexSyntheticUsage ? resolveCodexSyntheticUsageAuthProfileId({
		profileId: sessionEntry?.authProfileOverride,
		cfg,
		agentDir: statusAgentDir
	}) : void 0;
	const usageCredentialType = useCodexSyntheticUsage ? "token" : selectedUsageCredentialType;
	const currentUsageProvider = resolveUsageProviderId(usageStatusProvider, { credentialType: usageCredentialType }) ?? resolveUsageProviderId(usageProvider, { credentialType: usageCredentialType });
	let usageLine = null;
	if (currentUsageProvider && shouldLoadUsageSummary({
		provider: currentUsageProvider,
		selectedModelAuth: usageAuthLabel,
		credentialType: usageCredentialType
	})) try {
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
	const channelFeatureLine = resolveStatusChannelFeatureLine({
		cfg,
		statusChannel,
		statusAccountId: params.statusAccountId,
		sessionEntry
	});
	const { buildStatusMessageParts } = await loadStatusMessageRuntime();
	await waitForContextWindowCacheLoad();
	const configuredThinkingDefault = resolveConfiguredThinkingDefaultCore({
		cfg,
		agentId: statusAgentId,
		provider: selectedLookupProvider,
		model: selectedLookupModel
	});
	const preparedContextTokens = typeof contextTokens === "number" && contextTokens > 0 ? contextTokens : void 0;
	const selectedCatalogEntry = findModelInCatalog(thinkingCatalog ?? [], selectedLookupProvider, selectedLookupModel);
	const initialActiveCatalogEntry = findModelInCatalog(thinkingCatalog ?? [], activeProvider, modelRefs.active.model || model);
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
	return buildStatusMessageParts({
		config: cfg,
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
		selectedContextTokens: selectedCatalogEntry?.contextTokens ?? (selectedCatalogEntry && !activeRuntimeIsAuthoritative ? preparedContextTokens : void 0),
		thinkingCatalog,
		runtimeContextProvider: activeRuntimeIsAuthoritative ? activeStatusProvider : void 0,
		runtimeContextTokens: activeRuntimeIsAuthoritative && (initialActiveCatalogEntry || fallbackState.active) && (!activeModel || activeModel.modelProvider === provider && activeModel.model === model) ? preparedContextTokens : void 0,
		sessionEntry,
		sessionKey,
		parentSessionKey,
		sessionScope,
		sessionStorePath: storePath,
		groupActivation,
		resolvedThink: effectiveThinkLevel,
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
		includeTranscriptUsage: params.includeTranscriptUsage ?? true
	});
}
//#endregion
export { buildStatusText as n, buildStatusReplyParts as t };
