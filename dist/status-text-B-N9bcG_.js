import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { o as toAgentModelListLike } from "./model-input-BHKiDwaq.js";
import { d as resolveAgentModelFallbacksOverride, v as resolveSessionAgentId, w as hasSessionAutoModelFallbackProvenance } from "./agent-scope-CDZXADgT.js";
import { n as normalizeAccountId } from "./account-id-5IgE9UKY.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-C3ijpoNo.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-CNlVI3wV.js";
import { i as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-DXJmS9CT.js";
import { n as ensureAuthProfileStore } from "./store-SfOB_T2S.js";
import { t as CODEX_APP_SERVER_AUTH_MARKER } from "./model-auth-markers-C4s6SbvA.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-i8V2iTdL.js";
import { n as formatTaskStatusDetail, r as formatTaskStatusTitle, t as buildTaskStatusSnapshot } from "./task-status-Df6f9W0E.js";
import { o as resolveContextTokensForModel } from "./context-CDxACcUL.js";
import { t as resolveFastModeState } from "./fast-mode-BHYJgNkm.js";
import { n as resolveNormalizedAccountEntry } from "./account-lookup-DjMZZ6go.js";
import { o as shouldPreferActiveRuntimeAliasAuthLabel, t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-CZ8RT-Uc.js";
import { c as resolveMainSessionAlias, s as resolveInternalSessionKey } from "./sessions-helpers-C4SbQrlb.js";
import { t as formatDurationCompact } from "./format-duration-BrZ-AaEJ.js";
import { a as listTasksForSessionKeyForStatus, r as listTasksForAgentIdForStatus } from "./task-status-access-qAYBeBip.js";
import { t as normalizeGroupActivation } from "./group-activation-MKTJBUwi.js";
import { t as resolveModelAuthLabel } from "./model-auth-label-qSfKlpdI.js";
import { o as resolveUsageProviderId } from "./provider-usage.shared-ayVH6rxf.js";
import { n as resolveSelectedAndActiveModel } from "./model-runtime-BB6gttUw.js";
import { r as formatUsageWindowSummary } from "./provider-usage-Da4LeMMo.js";
import { t as loadProviderUsageSummary } from "./provider-usage.load-DDxjIu41.js";
import { r as formatCompactPluginHealthLine } from "./status-plugin-health-CVz23luC.js";
import os from "node:os";
//#region src/status/status-text.ts
const USAGE_OAUTH_ONLY_PROVIDERS = new Set([
	"anthropic",
	"github-copilot",
	"google-gemini-cli",
	"openai"
]);
function resolveStatusChannelFeatureLine(params) {
	if (normalizeOptionalLowercaseString(params.statusChannel) !== "telegram") return;
	const telegramConfig = params.cfg.channels?.telegram;
	const accountId = normalizeAccountId(params.statusAccountId ?? params.sessionEntry?.lastAccountId ?? params.sessionEntry?.origin?.accountId ?? telegramConfig?.defaultAccount);
	const accountConfig = resolveNormalizedAccountEntry(telegramConfig?.accounts, accountId, normalizeAccountId);
	if ((accountConfig?.richMessages ?? telegramConfig?.richMessages) === true) return "Telegram rich messages: on · Bot API 10.1 sendRichMessage enabled";
	return accountConfig?.richMessages === false ? "Telegram rich messages: off · enable richMessages for this Telegram account" : "Telegram rich messages: off · set channels.telegram.richMessages=true for tables/details/rich media";
}
let statusMessageRuntimePromise = null;
let agentHarnessSelectionRuntimePromise = null;
let statusQueueRuntimePromise = null;
let statusSubagentsRuntimePromise = null;
let statusPluginHealthRuntimePromise = null;
function loadStatusMessageRuntime() {
	return statusMessageRuntimePromise ??= import("./status-message.runtime.js").then((module) => module.loadStatusMessageRuntimeModule());
}
function loadAgentHarnessSelectionRuntime() {
	return agentHarnessSelectionRuntimePromise ??= import("./selection-B-jTuuc7.js");
}
function loadStatusSubagentsRuntime() {
	return statusSubagentsRuntimePromise ??= import("./status-subagents.runtime.js");
}
function loadStatusQueueRuntime() {
	return statusQueueRuntimePromise ??= import("./status-queue.runtime.js");
}
function loadStatusPluginHealthRuntime() {
	return statusPluginHealthRuntimePromise ??= import("./status-plugin-health.runtime.js");
}
function resolveStatusRuntimeContextTokens(params) {
	return resolveContextTokensForModel({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		allowAsyncLoad: false
	});
}
function shouldLoadUsageSummary(params) {
	if (!params.provider) return false;
	if (!USAGE_OAUTH_ONLY_PROVIDERS.has(params.provider)) return true;
	const auth = normalizeOptionalLowercaseString(params.selectedModelAuth);
	return Boolean(params.credentialType === "oauth" || params.credentialType === "token" || auth?.startsWith("oauth") || auth?.startsWith("token"));
}
function resolveUsageCredentialType(authLabel) {
	const auth = normalizeOptionalLowercaseString(authLabel);
	if (!auth) return;
	if (auth.startsWith("oauth")) return "oauth";
	if (auth.startsWith("token")) return "token";
	if (auth.startsWith("api-key") || auth.startsWith("api key")) return "api_key";
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
		const credentialProvider = normalizeOptionalLowercaseString(credential.provider);
		return resolveProviderIdForAuth(credential.provider, { config: params.cfg }) === "openai" || credentialProvider === "openai-codex" || credentialProvider === "codex-cli" ? normalizedProfileId : void 0;
	} catch {
		return;
	}
}
function shouldUseCodexSyntheticUsage(params) {
	const harness = normalizeOptionalLowercaseString(params.effectiveHarness);
	const provider = normalizeOptionalLowercaseString(params.provider);
	return harness === "codex" && (provider === "openai" || provider === "codex");
}
function formatSessionTaskLine(sessionKey) {
	const snapshot = buildTaskStatusSnapshot(listTasksForSessionKeyForStatus(sessionKey));
	const task = snapshot.focus;
	if (!task) return;
	const headline = snapshot.activeCount > 0 ? `${snapshot.activeCount} active · ${snapshot.totalCount} total` : snapshot.recentFailureCount > 0 ? `${snapshot.recentFailureCount} recent failure${snapshot.recentFailureCount === 1 ? "" : "s"}` : "recently finished";
	const title = formatTaskStatusTitle(task);
	const detail = formatTaskStatusDetail(task);
	const parts = [
		headline,
		task.runtime,
		title,
		detail
	].filter(Boolean);
	return parts.length ? `📌 Tasks: ${parts.join(" · ")}` : void 0;
}
async function resolveStatusHarnessId(params) {
	try {
		const { selectAgentHarness } = await loadAgentHarnessSelectionRuntime();
		return normalizeOptionalLowercaseString(selectAgentHarness({
			provider: params.provider,
			modelId: params.model,
			config: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			agentHarnessId: params.sessionEntry?.agentHarnessId
		}).id) || void 0;
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
function formatAgentTaskCountsLine(agentId) {
	const snapshot = buildTaskStatusSnapshot(listTasksForAgentIdForStatus(agentId));
	if (snapshot.totalCount === 0) return;
	return `📌 Tasks: ${snapshot.activeCount} active · ${snapshot.totalCount} total · agent-local`;
}
function formatStatusUptimeDuration(ms) {
	return formatDurationCompact(ms, { spaced: true }) ?? "0s";
}
function buildStatusUptimeLine() {
	const gatewayUptimeMs = Math.max(0, Math.round(process.uptime() * 1e3));
	const systemUptimeMs = Math.max(0, Math.round(os.uptime() * 1e3));
	return `⏱️ Uptime: gateway ${formatStatusUptimeDuration(gatewayUptimeMs)} · system ${formatStatusUptimeDuration(systemUptimeMs)}`;
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
	const { cfg, sessionEntry, sessionKey, parentSessionKey, sessionScope, storePath, statusChannel, provider, model, contextTokens, resolvedThinkLevel, resolvedFastMode, resolvedVerboseLevel, resolvedReasoningLevel, resolvedElevatedLevel, resolveDefaultThinkingLevel, isGroup, defaultGroupActivation } = params;
	const statusAgentId = sessionKey ? resolveSessionAgentId({
		sessionKey,
		config: cfg
	}) : resolveDefaultAgentId(cfg);
	const statusAgentDir = resolveAgentDir(cfg, statusAgentId);
	const statusWorkspaceDir = params.workspaceDir ?? sessionEntry?.spawnedWorkspaceDir ?? resolveAgentWorkspaceDir(cfg, statusAgentId);
	const modelRefs = resolveSelectedAndActiveModel({
		selectedProvider: provider,
		selectedModel: model,
		sessionEntry
	});
	const effectiveHarness = params.resolvedHarness ?? await resolveStatusHarnessId({
		cfg,
		provider,
		model,
		agentId: statusAgentId,
		sessionKey,
		sessionEntry
	});
	const selectedStatusProvider = resolveStatusRuntimeProvider({
		provider,
		effectiveHarness
	});
	const selectedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
		provider,
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
	let selectedModelAuth = Object.hasOwn(params, "modelAuthOverride") ? params.modelAuthOverride : resolveModelAuthLabel({
		provider: selectedStatusProvider,
		acceptedProviderIds: selectedAuthProviders,
		cfg,
		sessionEntry,
		agentDir: statusAgentDir,
		workspaceDir: statusWorkspaceDir,
		includeExternalProfiles: false
	});
	const activeModelAuth = Object.hasOwn(params, "activeModelAuthOverride") ? params.activeModelAuthOverride : modelRefs.activeDiffers ? resolveModelAuthLabel({
		provider: activeStatusProvider,
		acceptedProviderIds: activeAuthProviders,
		cfg,
		sessionEntry,
		agentDir: statusAgentDir,
		workspaceDir: statusWorkspaceDir,
		includeExternalProfiles: false
	}) : selectedModelAuth;
	if (shouldPreferActiveRuntimeAliasAuthLabel({
		runtimeAliasModelEquivalent: areRuntimeModelRefsEquivalent(modelRefs.selected.label, modelRefs.active.label, { config: cfg }),
		selectedAuthLabel: selectedModelAuth,
		activeAuthLabel: activeModelAuth
	})) selectedModelAuth = activeModelAuth;
	const usageAuthLabel = modelRefs.activeDiffers ? activeModelAuth : selectedModelAuth;
	const selectedUsageCredentialType = resolveUsageCredentialType(usageAuthLabel);
	const useCodexSyntheticUsage = shouldUseCodexSyntheticUsage({
		provider: activeStatusProvider,
		effectiveHarness
	}) && (selectedUsageCredentialType === "oauth" || selectedUsageCredentialType === "token");
	const codexUsageAuthProfileId = useCodexSyntheticUsage ? resolveCodexSyntheticUsageAuthProfileId({
		profileId: sessionEntry?.authProfileOverride,
		cfg,
		agentDir: statusAgentDir
	}) : void 0;
	const usageCredentialType = useCodexSyntheticUsage ? "token" : selectedUsageCredentialType;
	const currentUsageProvider = resolveUsageProviderId(activeStatusProvider, { credentialType: usageCredentialType }) ?? resolveUsageProviderId(activeProvider, { credentialType: usageCredentialType });
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
			auth: useCodexSyntheticUsage ? [{
				provider: "openai",
				token: CODEX_APP_SERVER_AUTH_MARKER,
				...codexUsageAuthProfileId ? { authProfileId: codexUsageAuthProfileId } : {},
				hookProvider: "codex"
			}] : void 0
		}), new Promise((_, reject) => {
			usageTimeout = setTimeout(() => reject(/* @__PURE__ */ new Error("usage summary timeout")), usageSummaryTimeoutMs);
		})]).finally(() => {
			if (usageTimeout) clearTimeout(usageTimeout);
		})).providers[0];
		if (usageEntry && !usageEntry.error && (usageEntry.windows.length > 0 || Boolean(usageEntry.summary?.trim()))) {
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
		taskLine = params.skipDefaultTaskLookup ? params.taskLineOverride : params.taskLineOverride ?? formatSessionTaskLine(requesterKey);
		if (!taskLine && !params.skipDefaultTaskLookup) taskLine = formatAgentTaskCountsLine(statusAgentId);
		const { buildSubagentsStatusLine, countPendingDescendantRuns, listControlledSubagentRuns } = await loadStatusSubagentsRuntime();
		subagentsLine = buildSubagentsStatusLine({
			runs: listControlledSubagentRuns(requesterKey),
			verboseEnabled: resolvedVerboseLevel && resolvedVerboseLevel !== "off",
			pendingDescendantsForRun: (entry) => countPendingDescendantRuns(entry.childSessionKey)
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
	const { buildStatusMessage } = await loadStatusMessageRuntime();
	const explicitThinkingDefault = agentConfig?.thinkingDefault ?? agentDefaults.thinkingDefault;
	const configuredContextTokens = typeof agentConfig?.contextTokens === "number" && agentConfig.contextTokens > 0 ? agentConfig.contextTokens : typeof agentDefaults.contextTokens === "number" && agentDefaults.contextTokens > 0 ? agentDefaults.contextTokens : void 0;
	const runtimeContextTokens = resolveStatusRuntimeContextTokens({
		cfg,
		provider: activeStatusProvider,
		model: modelRefs.active.model || model
	});
	const selectedContextTokens = resolveStatusRuntimeContextTokens({
		cfg,
		provider: selectedStatusProvider,
		model
	});
	const runtimeSnapshotHasFallbackProvenance = !modelRefs.activeDiffers || hasSessionAutoModelFallbackProvenance(sessionEntry) || areRuntimeModelRefsEquivalent(modelRefs.active.label, modelRefs.selected.label, { config: cfg });
	const statusAgentContextTokens = typeof contextTokens === "number" && contextTokens > 0 && (runtimeSnapshotHasFallbackProvenance || contextTokens === configuredContextTokens || contextTokens === selectedContextTokens) ? contextTokens : void 0;
	const statusRuntimeContextTokens = runtimeSnapshotHasFallbackProvenance ? runtimeContextTokens : void 0;
	return buildStatusMessage({
		config: cfg,
		agent: {
			...agentDefaults,
			model: {
				...toAgentModelListLike(agentDefaults.model),
				primary: params.primaryModelLabelOverride ?? `${provider}/${model}`,
				...agentFallbacksOverride === void 0 ? {} : { fallbacks: agentFallbacksOverride }
			},
			...statusAgentContextTokens !== void 0 ? { contextTokens: statusAgentContextTokens } : {},
			thinkingDefault: explicitThinkingDefault,
			verboseDefault: agentDefaults.verboseDefault,
			reasoningDefault: agentConfig?.reasoningDefault ?? agentDefaults.reasoningDefault,
			elevatedDefault: agentDefaults.elevatedDefault
		},
		agentId: statusAgentId,
		configuredDefaultModelLabel,
		explicitConfiguredContextTokens: configuredContextTokens,
		runtimeContextTokens: statusRuntimeContextTokens,
		sessionEntry,
		sessionKey,
		parentSessionKey,
		sessionScope,
		sessionStorePath: storePath,
		groupActivation,
		resolvedThink: resolvedThinkLevel ?? explicitThinkingDefault ?? await resolveDefaultThinkingLevel(),
		resolvedFast: effectiveFastMode,
		resolvedHarness: effectiveHarness,
		resolvedVerbose: resolvedVerboseLevel,
		resolvedReasoning: resolvedReasoningLevel,
		resolvedElevated: resolvedElevatedLevel,
		modelAuth: selectedModelAuth,
		activeModelAuth,
		uptimeLine: buildStatusUptimeLine(),
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
export { buildStatusText as t };
