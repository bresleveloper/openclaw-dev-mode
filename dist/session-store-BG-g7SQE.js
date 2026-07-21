import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-10KxeiYV.js";
import { t as resolveNonNegativeNumber } from "./number-coercion-EqFmHmOw.js";
import "./defaults-mDjiWzE5.js";
import { X as resolveMaintenanceConfigFromInput } from "./store-Cvp82S16.js";
import { d as setSessionRuntimeModel } from "./types-CoDcFuoc.js";
import { C as patchSessionEntry } from "./session-accessor-CwhXEUId.js";
import { t as isCliProvider } from "./model-selection-cli-DB4l0L04.js";
import "./model-selection-CFL1kjzt.js";
import { h as resolveCompactionSessionFile } from "./sessions-BIAJdhW6.js";
import { i as hasNonzeroUsage, r as deriveSessionTotalTokens } from "./usage-BJjt0RVM.js";
import { a as setCliSessionBinding, n as clearCliSession, o as setCliSessionId } from "./cli-session-Brkq2YyO.js";
import { i as projectSessionSnapshotChanges } from "./session-snapshot-merge-BUp0DZlF.js";
//#region src/agents/command/session-store.ts
/**
* Updates persisted session metadata after agent command runs.
*/
const usageFormatModuleLoader = createLazyImportLoader(() => import("./usage-format-PkyxlSl0.js"));
const contextModuleLoader = createLazyImportLoader(() => import("./context-DQIK88_0.js"));
async function getUsageFormatModule() {
	return await usageFormatModuleLoader.load();
}
async function getContextModule() {
	return await contextModuleLoader.load();
}
function resolvePositiveInteger(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
/** Applies run result metadata, usage, and CLI bindings to a session entry. */
async function updateSessionStoreAfterAgentRun(params) {
	const { cfg, sessionId, sessionKey, storePath, sessionStore, defaultProvider, defaultModel, fallbackProvider, fallbackModel, result } = params;
	const now = Date.now();
	const touchInteraction = params.touchInteraction !== false;
	const touchActivity = params.touchActivity !== false;
	const usage = result.meta.agentMeta?.usage;
	const promptTokens = result.meta.agentMeta?.promptTokens;
	const lastCallUsage = result.meta.agentMeta?.lastCallUsage;
	const compactionTokensAfter = typeof result.meta.agentMeta?.compactionTokensAfter === "number" && Number.isFinite(result.meta.agentMeta.compactionTokensAfter) && result.meta.agentMeta.compactionTokensAfter >= 0 ? Math.floor(result.meta.agentMeta.compactionTokensAfter) : void 0;
	const compactionsThisRun = Math.max(0, result.meta.agentMeta?.compactionCount ?? 0);
	const modelUsed = result.meta.agentMeta?.model ?? fallbackModel ?? defaultModel;
	const providerUsed = result.meta.agentMeta?.provider ?? fallbackProvider ?? defaultProvider;
	const agentHarnessId = normalizeOptionalString(result.meta.agentMeta?.agentHarnessId);
	const activeSessionFile = normalizeOptionalString(result.meta.agentMeta?.sessionFile);
	const runtimeContextTokens = resolvePositiveInteger(result.meta.agentMeta?.contextTokens);
	const contextBudgetStatus = result.meta.agentMeta?.contextBudgetStatus;
	const contextTokens = runtimeContextTokens !== void 0 ? runtimeContextTokens : (await getContextModule()).resolveContextTokensForModel({
		cfg,
		provider: providerUsed,
		model: modelUsed,
		contextTokensOverride: params.contextTokensOverride,
		fallbackContextTokens: 2e5,
		allowAsyncLoad: false
	}) ?? 2e5;
	const preserveUserFacingRunState = params.preserveUserFacingSessionModelState === true;
	const preserveRuntimeModel = params.preserveRuntimeModel === true || preserveUserFacingRunState;
	const entry = sessionStore[sessionKey] ?? {
		sessionId,
		updatedAt: now,
		sessionStartedAt: now
	};
	const next = {
		...entry,
		sessionId,
		updatedAt: now,
		sessionStartedAt: entry.sessionId === sessionId ? entry.sessionStartedAt ?? now : now,
		lastInteractionAt: touchInteraction ? now : entry.lastInteractionAt,
		lastActivityAt: touchActivity ? now : entry.lastActivityAt,
		...preserveRuntimeModel ? {} : { contextTokens }
	};
	if (entry.sessionId !== sessionId) {
		next.sessionFile = activeSessionFile ?? resolveCompactionSessionFile({
			entry,
			sessionKey,
			storePath,
			newSessionId: sessionId
		});
		next.usageFamilyKey = entry.usageFamilyKey ?? sessionKey;
		next.usageFamilySessionIds = Array.from(/* @__PURE__ */ new Set([
			...entry.usageFamilySessionIds ?? [],
			entry.sessionId,
			sessionId
		]));
	} else if (activeSessionFile) next.sessionFile = activeSessionFile;
	if (preserveRuntimeModel) {
		if (entry.model) {
			next.contextTokens = entry.contextTokens;
			if (entry.modelProvider) setSessionRuntimeModel(next, {
				provider: entry.modelProvider,
				model: entry.model
			});
			else next.model = entry.model;
		}
	} else setSessionRuntimeModel(next, {
		provider: providerUsed,
		model: modelUsed
	});
	if (!preserveUserFacingRunState) {
		if (!preserveRuntimeModel) {
			if (agentHarnessId) next.agentHarnessId = agentHarnessId;
			else if (result.meta.executionTrace?.runner === "cli") next.agentHarnessId = void 0;
		}
		if (!preserveRuntimeModel && isCliProvider(providerUsed, cfg)) {
			const cliSessionBinding = result.meta.agentMeta?.cliSessionBinding;
			if (result.meta.agentMeta?.clearCliSessionBinding === true) clearCliSession(next, providerUsed);
			else if (cliSessionBinding?.sessionId?.trim()) setCliSessionBinding(next, providerUsed, cliSessionBinding);
			else {
				const cliSessionId = result.meta.agentMeta?.sessionId?.trim();
				if (cliSessionId) setCliSessionId(next, providerUsed, cliSessionId);
			}
		}
		next.abortedLastRun = result.meta.aborted ?? false;
		if (result.meta.systemPromptReport) next.systemPromptReport = result.meta.systemPromptReport;
		if (!preserveRuntimeModel) next.contextBudgetStatus = contextBudgetStatus;
	}
	if (hasNonzeroUsage(usage) && !preserveUserFacingRunState) {
		const { estimateUsageCost, resolveModelCostConfig } = await getUsageFormatModule();
		const input = usage.input ?? 0;
		const output = usage.output ?? 0;
		const usageForContext = isCliProvider(providerUsed, cfg) ? lastCallUsage : lastCallUsage?.contextUsage ? lastCallUsage : usage;
		const totalTokens = deriveSessionTotalTokens({
			usage: promptTokens ? void 0 : usageForContext,
			contextTokens,
			promptTokens
		});
		const runEstimatedCostUsd = resolveNonNegativeNumber(estimateUsageCost({
			usage,
			cost: resolveModelCostConfig({
				provider: providerUsed,
				model: modelUsed,
				config: cfg
			})
		}));
		next.inputTokens = input;
		next.outputTokens = output;
		const hasUsageTotalTokens = typeof totalTokens === "number" && Number.isFinite(totalTokens) && totalTokens > 0;
		const useCompactionSnapshot = compactionTokensAfter !== void 0 && !hasUsageTotalTokens;
		if (useCompactionSnapshot) {
			next.totalTokens = compactionTokensAfter;
			next.totalTokensFresh = true;
			next.inputTokens = void 0;
			next.outputTokens = void 0;
			next.cacheRead = void 0;
			next.cacheWrite = void 0;
			next.contextBudgetStatus = void 0;
		} else if (hasUsageTotalTokens) {
			next.totalTokens = totalTokens;
			next.totalTokensFresh = true;
		} else {
			next.totalTokens = void 0;
			next.totalTokensFresh = false;
		}
		if (!useCompactionSnapshot) {
			next.cacheRead = usage.cacheRead ?? 0;
			next.cacheWrite = usage.cacheWrite ?? 0;
		}
		if (runEstimatedCostUsd !== void 0) next.estimatedCostUsd = runEstimatedCostUsd;
	} else if (compactionTokensAfter !== void 0 && !preserveUserFacingRunState) {
		next.totalTokens = compactionTokensAfter;
		next.totalTokensFresh = true;
		next.inputTokens = void 0;
		next.outputTokens = void 0;
		next.cacheRead = void 0;
		next.cacheWrite = void 0;
		next.contextBudgetStatus = void 0;
	} else if (!preserveUserFacingRunState && typeof entry.totalTokens === "number" && Number.isFinite(entry.totalTokens) && entry.totalTokens > 0) {
		next.totalTokens = entry.totalTokens;
		next.totalTokensFresh = false;
	}
	if (compactionsThisRun > 0 && !preserveUserFacingRunState) next.compactionCount = (entry.compactionCount ?? 0) + compactionsThisRun;
	const metadataPatch = preserveUserFacingRunState ? {
		updatedAt: next.updatedAt,
		...touchInteraction ? { lastInteractionAt: next.lastInteractionAt } : {}
	} : next;
	const maintenanceConfig = resolveMaintenanceConfigFromInput(cfg.session?.maintenance);
	const persisted = await patchSessionEntry({
		storePath,
		sessionKey
	}, (currentEntry, context) => {
		if (!preserveUserFacingRunState && context.existingEntry && context.existingEntry.sessionId !== entry.sessionId || !context.existingEntry && sessionStore[sessionKey]) return null;
		return preserveUserFacingRunState ? metadataPatch : projectSessionSnapshotChanges({
			initial: entry,
			next,
			current: currentEntry
		});
	}, {
		...preserveUserFacingRunState ? {} : { fallbackEntry: entry },
		maintenanceConfig
	});
	if (persisted) sessionStore[sessionKey] = persisted;
}
/** Clears a stored CLI session binding after a failed or invalidated run. */
async function clearCliSessionInStore(params) {
	const { provider, sessionKey, sessionStore, storePath, expectedSessionId } = params;
	const entry = sessionStore[sessionKey];
	if (!entry) return;
	const next = { ...entry };
	clearCliSession(next, provider);
	next.updatedAt = Date.now();
	const persisted = await patchSessionEntry({
		storePath,
		sessionKey
	}, (currentEntry, context) => {
		if (expectedSessionId && (!context.existingEntry || currentEntry.sessionId !== expectedSessionId)) return null;
		return next;
	}, { fallbackEntry: entry });
	if (persisted) sessionStore[sessionKey] = persisted;
	return persisted ?? void 0;
}
/** Records CLI compaction metadata on the persisted session entry. */
async function recordCliCompactionInStore(params) {
	const { provider, sessionKey, sessionStore, storePath, expectedSessionId } = params;
	const entry = sessionStore[sessionKey];
	if (!entry) return;
	const next = { ...entry };
	clearCliSession(next, provider);
	next.compactionCount = (entry.compactionCount ?? 0) + 1;
	next.updatedAt = Date.now();
	const newSessionId = normalizeOptionalString(params.newSessionId);
	const explicitNewSessionFile = normalizeOptionalString(params.newSessionFile);
	const sessionIdChanged = Boolean(newSessionId && newSessionId !== entry.sessionId);
	const sessionFileChanged = Boolean(explicitNewSessionFile && explicitNewSessionFile !== entry.sessionFile);
	if (sessionIdChanged && newSessionId) {
		next.sessionId = newSessionId;
		next.sessionFile = explicitNewSessionFile ?? resolveCompactionSessionFile({
			entry,
			sessionKey,
			storePath,
			newSessionId
		});
		next.usageFamilyKey = entry.usageFamilyKey ?? sessionKey;
		next.usageFamilySessionIds = Array.from(/* @__PURE__ */ new Set([
			...entry.usageFamilySessionIds ?? [],
			entry.sessionId,
			newSessionId
		]));
	} else if (sessionFileChanged && explicitNewSessionFile) next.sessionFile = explicitNewSessionFile;
	const tokensAfterCompaction = resolveNonNegativeNumber(params.tokensAfter);
	next.contextBudgetStatus = void 0;
	if (tokensAfterCompaction !== void 0) {
		next.totalTokens = Math.floor(tokensAfterCompaction);
		next.totalTokensFresh = true;
		next.inputTokens = void 0;
		next.outputTokens = void 0;
		next.cacheRead = void 0;
		next.cacheWrite = void 0;
	} else {
		next.totalTokensFresh = false;
		next.inputTokens = void 0;
		next.outputTokens = void 0;
		next.cacheRead = void 0;
		next.cacheWrite = void 0;
	}
	const persisted = await patchSessionEntry({
		storePath,
		sessionKey
	}, (currentEntry, context) => {
		if (expectedSessionId && (!context.existingEntry || currentEntry.sessionId !== expectedSessionId)) return null;
		return next;
	}, { fallbackEntry: entry });
	if (persisted) sessionStore[sessionKey] = persisted;
	return persisted ?? void 0;
}
//#endregion
export { recordCliCompactionInStore as n, updateSessionStoreAfterAgentRun as r, clearCliSessionInStore as t };
