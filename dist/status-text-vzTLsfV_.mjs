import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { c as resolveSessionFilePathOptions, s as resolveSessionFilePathCore } from "./paths-CcMbq5NY.mjs";
import { l as toAgentModelListLike } from "./model-input-DKxKaZGG.mjs";
import { E as hasSessionAutoModelFallbackProvenance, _ as resolveSessionAgentId, u as resolveAgentModelFallbacksOverride } from "./agent-scope-CTuYDtny.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-BspGC-O6.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import { o as getPreparedModelRuntimeAuthStore } from "./prepared-model-runtime-auth-Bd3e65L_.mjs";
import { p as resolveActiveProviderThinkingProfile } from "./thinking-B1p5pEC8.mjs";
import { r as listRegisteredAgentHarnesses } from "./registry-1lXXOteg.mjs";
import { c as resolveUsageProviderId } from "./provider-usage.shared-DA20vxhR.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-BFAOd5yW.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { u as resolveAgentHarnessAutoSelectionHint } from "./availability-q42mVdu4.mjs";
import { c as shouldPreferActiveRuntimeAliasAuthLabel, t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-DZSSnYMd.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-CJOaEEoJ.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { t as formatDurationCompact } from "./format-duration-CeDWULoS.mjs";
import { i as formatTaskStatusTitle, n as formatTaskStatus, r as formatTaskStatusDetail } from "./task-status-D1-umRs5.mjs";
import { t as normalizeGroupActivation } from "./group-activation-CS1DbKiO.mjs";
import { c as readTaskStatusSnapshots } from "./task-status-access-BPrGRqBY.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import { i as formatUsd } from "./usage-format-CisMpgmJ.mjs";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey } from "./sessions-helpers-0nPieSUh.mjs";
import { s as waitForContextWindowCacheLoad } from "./context-na2bB1IO.mjs";
import { t as resolveFastModeState } from "./fast-mode-D3LS63Ki.mjs";
import { n as resolveSelectedAndActiveModel, t as readSessionFallbackModel } from "./session-fallback-model-D-bv1sOC.mjs";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-RaMg3ufK.mjs";
import { t as createModelCatalogDecisions } from "./model-catalog-decisions-DouPpwJV.mjs";
import { t as resolveModelAuthLabel } from "./model-auth-label-UFBneRfT.mjs";
import { r as formatCompactPluginHealthLine } from "./status-plugin-health-C6MQh24h.mjs";
import { n as formatUsageWindowSummary } from "./provider-usage.format-Z_dzle_W.mjs";
import { t as loadProviderUsageSummary } from "./provider-usage.load-Bx9i3fWl.mjs";
import "./provider-usage-BLQDvCQr.mjs";
import { i as shouldUseCodexSyntheticUsageForRuntime, r as resolveUsageCredentialType, t as buildCodexSyntheticUsageAuth } from "./codex-synthetic-usage-CI6dR4_k.mjs";
import { i as formatMissingCostEntries } from "./session-cost-usage-totals-D4e-85ui.mjs";
import { a as resolveExistingUsageSessionFile } from "./session-cost-usage-collection-B_B8K725.mjs";
import { s as loadSessionCostSummariesFromCache } from "./session-cost-usage-DWPW66cA.mjs";
import os from "node:os";
//#region src/status/status-model-auth.ts
/** Native status uses the same prepared account and route as model selection. */
function createStatusModelAuthResolver(params) {
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
		if (!owner || !runtimeId || runtimeId === "openclaw" || runtimeId === "auto" || provider === runtimeId) return resolveModelAuthLabel({
			provider,
			acceptedProviderIds: selection.acceptedProviderIds,
			cfg: params.cfg,
			sessionEntry,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			includeExternalProfiles: false
		});
		if (!decisions?.isCurrent() || !authStore) return "unknown";
		const entry = findModelInCatalog(decisions.snapshot.entries, provider, model);
		const variants = decisions.snapshot.routeVariants.filter((row) => row.provider === provider && row.id === model);
		const host = await decisions.evaluateEntry(entry ?? {
			provider,
			id: model
		}, variants.length ? variants : entry ? [entry] : void 0, runtimeId);
		const evaluation = entry ? decisions.evaluateNative(entry, host, runtimeId) : host;
		if (!decisions.isCurrent() || evaluation.availability !== true) return "unknown";
		if (evaluation.runtimeAuth && evaluation.runtimeAuth.id !== runtimeId) return "unknown";
		const mode = evaluation.selectedAuthMode === "api_key" ? "api-key" : evaluation.selectedAuthMode;
		const profileId = evaluation.selectedProfileId;
		if (profileId) {
			const label = isUserModelAuthProfileId(profileId) ? "personal account" : resolveAuthProfileDisplayLabel({
				cfg: params.cfg,
				store: authStore,
				profileId
			});
			return mode ? mode + (label ? " (" + label + ")" : "") : "unknown";
		}
		return evaluation.runtimeAuth ? (mode ?? "native") + " (" + runtimeId + ")" : mode ?? "unknown";
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
		const pathOpts = resolveSessionFilePathOptions({
			storePath: params.storePath,
			agentId: params.agentId
		});
		sessionFile = resolveExistingUsageSessionFile({
			sessionId,
			sessionEntry: params.sessionEntry,
			sessionFile: resolveSessionFilePathCore(sessionId, params.sessionEntry, pathOpts),
			agentId: params.agentId
		});
	} catch {
		return;
	}
	if (!sessionFile) return;
	const now = Date.now();
	const date = new Date(now);
	const startMs = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	let timeout;
	try {
		const loaded = await Promise.race([loadSessionCostSummariesFromCache({
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
		}), new Promise((_, reject) => {
			timeout = setTimeout(() => reject(/* @__PURE__ */ new Error("session cost timeout")), 3500);
		})]).finally(() => {
			if (timeout) clearTimeout(timeout);
		});
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
const loadAgentThinkingRuntime = createLazyPromise(() => import("./thinking-runtime-21zjNIdl.mjs"));
const loadThinkingLevelRuntime = createLazyPromise(() => import("./thinking-C11exOi2.mjs"));
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
function formatSessionTaskLine(snapshot) {
	const task = snapshot.focus;
	if (!task) return;
	const headline = snapshot.activeCount > 0 ? `${snapshot.activeCount} active · ${snapshot.totalCount} total` : snapshot.recentFailureCount > 0 ? `${snapshot.recentFailureCount} recent failure${snapshot.recentFailureCount === 1 ? "" : "s"}` : "recently finished";
	const title = formatTaskStatusTitle(task);
	const detail = formatTaskStatusDetail(task);
	const parts = [
		headline,
		formatTaskStatus(task) === "blocked" ? "blocked" : void 0,
		task.runtime,
		title,
		detail
	].filter(Boolean);
	return parts.length ? `📌 Tasks: ${parts.join(" · ")}` : void 0;
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
function formatAgentTaskCountsLine(snapshot) {
	if (!snapshot || snapshot.totalCount === 0) return;
	return `📌 Tasks: ${snapshot.activeCount} active · ${snapshot.totalCount} total · agent-local`;
}
async function resolveRuntimePluginHealthLine() {
	try {
		const { collectRuntimePluginHealthSnapshot } = await loadStatusPluginHealthRuntime();
		return formatCompactPluginHealthLine(collectRuntimePluginHealthSnapshot());
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
	const { getPreparedModelCatalogOwnerSnapshot, materializePreparedModelCatalogOwner } = await import("./prepared-model-catalog-CHKgcpJj.mjs");
	const preparedOwner = getPreparedModelCatalogOwnerSnapshot({
		config: cfg,
		agentId: statusAgentId,
		agentDir: statusAgentDir,
		workspaceDir: statusWorkspaceDir,
		readOnly: true
	});
	const resolveAuth = createStatusModelAuthResolver({
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
	let selectedModelAuth = Object.hasOwn(params, "modelAuthOverride") ? params.modelAuthOverride : await resolveAuth({
		provider: selectedStatusProvider,
		model: selectedLookupModel,
		runtimeId: effectiveHarness,
		acceptedProviderIds: selectedAuthProviders
	});
	const activeModelAuth = Object.hasOwn(params, "activeModelAuthOverride") ? params.activeModelAuthOverride : modelRefs.activeDiffers ? await resolveAuth({
		provider: activeStatusProvider,
		model: modelRefs.active.model || model,
		runtimeId: effectiveHarness,
		acceptedProviderIds: activeAuthProviders
	}) : selectedModelAuth;
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
		let usageTimeout;
		const usageEntry = (await Promise.race([loadProviderUsageSummary({
			timeoutMs: usageSummaryTimeoutMs,
			providers: [currentUsageProvider],
			agentDir: statusAgentDir,
			workspaceDir: statusWorkspaceDir,
			config: cfg,
			auth: useCodexSyntheticUsage ? [buildCodexSyntheticUsageAuth({ authProfileId: codexUsageAuthProfileId })] : void 0
		}), new Promise((_, reject) => {
			usageTimeout = setTimeout(() => reject(/* @__PURE__ */ new Error("usage summary timeout")), usageSummaryTimeoutMs);
		})]).finally(() => {
			if (usageTimeout) clearTimeout(usageTimeout);
		})).providers[0];
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
	let taskLine;
	if (sessionKey) {
		const { mainKey, alias } = resolveMainSessionAlias(cfg);
		const requesterKey = resolveInternalSessionKey({
			key: sessionKey,
			alias,
			mainKey
		});
		taskLine = params.taskLineOverride;
		if (!params.skipDefaultTaskLookup && !taskLine) {
			const snapshots = await readTaskStatusSnapshots({
				sessionKey: taskLine === void 0 ? requesterKey : void 0,
				agentId: statusAgentId
			});
			snapshots.assertCurrent();
			taskLine ??= formatSessionTaskLine(snapshots.session);
			taskLine ||= formatAgentTaskCountsLine(snapshots.agent);
		}
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
		provider,
		model,
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
		taskLine,
		pluginHealthLine,
		channelFeatureLine,
		mediaDecisions: params.mediaDecisions,
		includeTranscriptUsage: params.includeTranscriptUsage ?? true
	});
}
//#endregion
export { buildStatusText as n, buildStatusReplyParts as t };
