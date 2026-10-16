import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import "./defaults-Jag53zwP.mjs";
import { t as clearAllCliSessions } from "./cli-session-binding-CMk8AbZT.mjs";
import { u as resolveMaintenanceConfigFromInput } from "./store-maintenance-CGOlSbiV.mjs";
import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { u as setSessionRuntimeModel } from "./types-BZlUzQZy.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { a as hasBillableUsage, i as deriveSessionTotalTokens, o as hasNonzeroUsage } from "./usage-XmAH1cfG.mjs";
import { g as COMPACTION_RUN_USAGE_CLEAR_PATCH } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { r as clearMainSessionRecoveryAfterAgentRun } from "./main-session-recovery-clear-BczELu-B.mjs";
import { n as estimateAggregateUsageCost } from "./usage-format-CmKsaFRe.mjs";
import "./sessions-DNhLX2Ep.mjs";
import "./cli-session-B9R5wqcb.mjs";
import { o as resolveContextTokensForModel } from "./context-qaLs5Adf.mjs";
import { i as projectSessionSnapshotChanges } from "./session-snapshot-merge-Dh-eJoIb.mjs";
//#region src/agents/command/session-store.ts
function normalizeSessionTokenCount(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
async function updateSessionStoreAfterAgentRun(params) {
	const { cfg, sessionId, sessionKey, storePath, sessionStore, defaultProvider, defaultModel, fallbackProvider, fallbackModel, result } = params;
	const now = Date.now();
	const touchInteraction = params.touchInteraction !== false;
	const touchActivity = params.touchActivity !== false;
	const usage = result.meta.agentMeta?.usage;
	const promptTokens = result.meta.agentMeta?.promptTokens;
	const lastCallUsage = result.meta.agentMeta?.lastCallUsage;
	const modelUsed = result.meta.agentMeta?.model ?? fallbackModel ?? defaultModel;
	const providerUsed = result.meta.agentMeta?.provider ?? fallbackProvider ?? defaultProvider;
	const agentHarnessId = normalizeOptionalString(result.meta.agentMeta?.agentHarnessId);
	const runtimeContextTokens = normalizeSessionTokenCount(result.meta.agentMeta?.contextTokens);
	const contextBudgetStatus = result.meta.agentMeta?.contextBudgetStatus;
	const contextTokens = runtimeContextTokens !== void 0 ? runtimeContextTokens : resolveContextTokensForModel({
		cfg,
		provider: providerUsed,
		model: modelUsed,
		fallbackContextTokens: 2e5,
		allowAsyncLoad: false
	}) ?? 2e5;
	const contextTokensSource = result.meta.agentMeta?.contextTokensSource ?? "resolved";
	const preserveUserFacingRunState = params.preserveUserFacingSessionModelState === true;
	const preserveRuntimeModel = params.preserveRuntimeModel === true || preserveUserFacingRunState;
	const hadPreExistingEntry = sessionStore[sessionKey] !== void 0;
	const entry = sessionStore[sessionKey] ?? {
		sessionId,
		updatedAt: now,
		sessionStartedAt: now
	};
	const expectedSession = params.compactionAccounting?.target ?? entry;
	if (!preserveUserFacingRunState && expectedSession.sessionId !== sessionId) return;
	const next = {
		...entry,
		updatedAt: now,
		sessionStartedAt: entry.sessionStartedAt ?? now,
		lastInteractionAt: touchInteraction ? now : entry.lastInteractionAt,
		lastActivityAt: touchActivity ? now : entry.lastActivityAt,
		...preserveRuntimeModel ? {} : {
			contextTokens,
			contextTokensSource
		}
	};
	if (!preserveRuntimeModel) setSessionRuntimeModel(next, {
		provider: providerUsed,
		model: modelUsed
	});
	else if (entry.model && entry.modelProvider) setSessionRuntimeModel(next, {
		provider: entry.modelProvider,
		model: entry.model
	});
	if (!preserveUserFacingRunState) {
		if (!preserveRuntimeModel) next.agentHarnessId = agentHarnessId;
		next.abortedLastRun = result.meta.aborted ?? false;
		clearMainSessionRecoveryAfterAgentRun(next, params.clearRestartRecoveryForceSafeTools);
		if (result.meta.systemPromptReport) next.systemPromptReport = result.meta.systemPromptReport;
		if (!preserveRuntimeModel) next.contextBudgetStatus = contextBudgetStatus;
	}
	const hasUsage = hasNonzeroUsage(usage);
	if (hasBillableUsage(usage) && !preserveUserFacingRunState) {
		const runEstimatedCostUsd = asNonNegativeFiniteNumber(estimateAggregateUsageCost({
			usage,
			provider: providerUsed,
			model: modelUsed,
			config: cfg,
			agentDir: params.agentDir
		}));
		if (hasUsage) {
			next.inputTokens = usage.input ?? 0;
			next.outputTokens = usage.output ?? 0;
			next.cacheRead = usage.cacheRead ?? 0;
			next.cacheWrite = usage.cacheWrite ?? 0;
		}
		next.estimatedCostUsd = runEstimatedCostUsd;
	}
	if (!preserveUserFacingRunState) {
		const currentContextSnapshot = params.compactionAccounting?.currentContextSnapshot;
		if (currentContextSnapshot || hasUsage) {
			const totalTokens = currentContextSnapshot ? currentContextSnapshot.tokens : deriveSessionTotalTokens({
				lastCallUsage,
				contextTokens,
				promptTokens
			});
			next.totalTokens = totalTokens;
			next.totalTokensFresh = totalTokens !== void 0;
			next.totalTokensVersion = totalTokens !== void 0 ? 1 : void 0;
		} else {
			next.totalTokensFresh = false;
			next.totalTokensVersion = void 0;
		}
	}
	const metadataPatch = preserveUserFacingRunState ? {
		updatedAt: next.updatedAt,
		...touchInteraction ? { lastInteractionAt: next.lastInteractionAt } : {}
	} : next;
	const maintenanceConfig = resolveMaintenanceConfigFromInput(cfg.session?.maintenance);
	await patchSessionEntryCore({
		agentId: params.agentId,
		storePath,
		sessionKey
	}, (currentEntry, context) => {
		if (!context.existingEntry && hadPreExistingEntry || !preserveUserFacingRunState && context.existingEntry && !isSameSessionLifecycleOwner(context.existingEntry, expectedSession)) return null;
		const patch = preserveUserFacingRunState ? metadataPatch : projectSessionSnapshotChanges({
			initial: entry,
			next,
			current: currentEntry,
			reassertAbortedLastRun: result.meta.aborted === true
		});
		if (touchActivity && !preserveUserFacingRunState && currentEntry.snoozedUntil !== void 0) {
			patch.snoozedUntil = void 0;
			patch.snoozedAt = void 0;
		}
		return patch;
	}, {
		...preserveUserFacingRunState || params.compactionAccounting ? {} : { fallbackEntry: entry },
		maintenanceConfig,
		onCommitted: (committed) => {
			sessionStore[sessionKey] = committed;
		}
	});
}
function isSameSessionLifecycleOwner(current, expected) {
	return current.sessionId === expected.sessionId && current.lifecycleRevision === expected.lifecycleRevision && current.activeWriterRunId === expected.activeWriterRunId;
}
/** Records CLI compaction metadata on the persisted session entry. */
async function recordCliCompactionInStore(params) {
	const { compactionKind, sessionKey, sessionStore, storePath, expectedSession } = params;
	const entry = sessionStore[sessionKey];
	if (!entry) return;
	const next = { ...entry };
	if (compactionKind === "context-engine") clearAllCliSessions(next);
	next.compactionCount = (entry.compactionCount ?? 0) + 1;
	next.updatedAt = Date.now();
	const tokensAfterCompaction = asNonNegativeFiniteNumber(params.tokensAfter);
	next.contextBudgetStatus = void 0;
	Object.assign(next, COMPACTION_RUN_USAGE_CLEAR_PATCH);
	if (tokensAfterCompaction !== void 0) {
		next.totalTokens = Math.floor(tokensAfterCompaction);
		next.totalTokensFresh = true;
		next.totalTokensVersion = 1;
	} else {
		next.totalTokensFresh = false;
		next.totalTokensVersion = void 0;
	}
	let committedEntry;
	await patchSessionEntryCore({
		agentId: params.agentId,
		storePath,
		sessionKey
	}, (currentEntry, context) => {
		if (!context.existingEntry || !isSameSessionLifecycleOwner(currentEntry, expectedSession)) return null;
		return {
			...currentEntry,
			...projectSessionSnapshotChanges({
				initial: entry,
				next,
				current: currentEntry
			}),
			compactionCount: (currentEntry.compactionCount ?? 0) + 1
		};
	}, { onCommitted: (committed) => {
		committedEntry = committed;
		sessionStore[sessionKey] = committed;
	} });
	return committedEntry;
}
//#endregion
export { recordCliCompactionInStore as n, updateSessionStoreAfterAgentRun as r, normalizeSessionTokenCount as t };
