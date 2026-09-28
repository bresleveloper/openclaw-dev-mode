import { l as asNonNegativeFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./defaults-BbU4k6fu.mjs";
import { t as clearAllCliSessions } from "./cli-session-binding-BhV_HbVa.mjs";
import { d as resolveMaintenanceConfigFromInput } from "./store-maintenance-C5xEVYop.mjs";
import { h as COMPACTION_RUN_USAGE_CLEAR_PATCH } from "./session-accessor.sqlite-transcript-write-CM5480eZ.mjs";
import { u as setSessionRuntimeModel } from "./types-ByCc34Vn.mjs";
import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { a as hasBillableUsage, i as deriveSessionTotalTokens, o as hasNonzeroUsage } from "./usage-XXLoqJQC.mjs";
import "./sessions-Cesa3L0p.mjs";
import { t as estimateAggregateUsageCost } from "./usage-format-CisMpgmJ.mjs";
import { r as clearMainSessionRecoveryAfterAgentRun } from "./main-session-recovery-clear-H7IP1700.mjs";
import { l as setCliSessionBinding } from "./cli-session-CeXeyPue.mjs";
import { a as resolveContextTokensForModel } from "./context-na2bB1IO.mjs";
import { i as projectSessionSnapshotChanges } from "./session-snapshot-merge-Br9OMCio.mjs";
//#region src/agents/command/session-store.ts
/**
* Updates persisted session metadata after agent command runs.
*/
function normalizeSessionTokenCount(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
/** Applies run result metadata and usage to a session entry. */
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
		if (!context.existingEntry && hadPreExistingEntry || !preserveUserFacingRunState && context.existingEntry && (context.existingEntry.sessionId !== expectedSession.sessionId || context.existingEntry.lifecycleRevision !== expectedSession.lifecycleRevision || context.existingEntry.activeWriterRunId !== expectedSession.activeWriterRunId)) return null;
		return preserveUserFacingRunState ? metadataPatch : projectSessionSnapshotChanges({
			initial: entry,
			next,
			current: currentEntry,
			reassertAbortedLastRun: result.meta.aborted === true
		});
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
async function patchCliSessionForkBinding(params, updateBinding) {
	const { provider, sessionKey, sessionStore, storePath, expectedCliSessionId } = params;
	const entry = sessionStore[sessionKey];
	if (!entry || entry.cliSessionBindings?.[provider]?.sessionId !== expectedCliSessionId) return;
	let committed;
	await patchSessionEntryCore({
		agentId: params.agentId,
		storePath,
		sessionKey
	}, (currentEntry) => {
		const currentBinding = currentEntry.cliSessionBindings?.[provider];
		if (!isSameSessionLifecycleOwner(currentEntry, entry) || currentBinding?.sessionId !== expectedCliSessionId) return null;
		const nextBinding = updateBinding(currentBinding);
		if (!nextBinding) return null;
		const next = { ...currentEntry };
		setCliSessionBinding(next, provider, nextBinding);
		return next;
	}, {
		assertCommitAllowed: params.assertCommitAllowed,
		onCommitted: (current) => {
			committed = current;
			sessionStore[sessionKey] = current;
		}
	});
	return committed;
}
/** Clears the one-shot fork marker before the resumed CLI process starts. */
async function consumeCliSessionForkInStore(params) {
	return await patchCliSessionForkBinding(params, (binding) => {
		if (binding.forkNextResume !== true) return;
		const { forkNextResume: _forkNextResume, ...consumedBinding } = binding;
		return consumedBinding;
	});
}
/** Arms a fork marker for recovery, or re-arms one after a failed CLI turn. */
async function restoreCliSessionForkInStore(params) {
	return await patchCliSessionForkBinding(params, (binding) => binding.forkNextResume === true ? void 0 : {
		...binding,
		forkNextResume: true
	});
}
/** Rebinds a claimed fork to its successor before the rest of the CLI turn can fail. */
async function persistCliSessionForkSuccessorInStore(params) {
	if (params.successorCliSessionId === params.expectedCliSessionId) return;
	return await patchCliSessionForkBinding(params, (binding) => binding.forkNextResume === true ? void 0 : {
		...binding,
		sessionId: params.successorCliSessionId,
		forceReuse: true
	});
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
		if (!context.existingEntry || currentEntry.sessionId !== expectedSession.sessionId || currentEntry.lifecycleRevision !== expectedSession.lifecycleRevision || currentEntry.activeWriterRunId !== expectedSession.activeWriterRunId) return null;
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
export { restoreCliSessionForkInStore as a, recordCliCompactionInStore as i, normalizeSessionTokenCount as n, updateSessionStoreAfterAgentRun as o, persistCliSessionForkSuccessorInStore as r, consumeCliSessionForkInStore as t };
