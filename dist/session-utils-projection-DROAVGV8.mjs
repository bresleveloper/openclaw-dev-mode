import { a as captureRuntimeStateEnvironment } from "./paths-DehQwyE0.mjs";
import { l as resolveSessionStorePathCore, r as resolveConcreteSessionStorePath } from "./paths-CcMbq5NY.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { j as iterateProjectedAgentRunSessionKeys, t as buildProjectedAgentRunIndex } from "./agent-run-registry-DO6Dg2r0.mjs";
import { n as buildSubagentSessionListReadIndex } from "./subagent-registry-read-C2SIiLpb.mjs";
import { r as readAcpSessionMeta } from "./session-meta-DHUOlEoy.mjs";
import { t as readAcpSessionMetaForEntry } from "./session-meta-readonly-CY2eWmkz.mjs";
import "./sessions-Cesa3L0p.mjs";
import { t as resolveSessionModelIdentityRef } from "./session-model-ref-DGVV7laa.mjs";
import { a as resolveEstimatedSessionCostUsd, c as createSessionRowModelCacheKey, o as resolvePositiveNumber } from "./session-utils-core-CPCyMcSJ.mjs";
import { t as resolveCurrentSessionAgentRuntimeMetadata } from "./agent-runtime-metadata--JWhWgO5.mjs";
import { i as selectModelCatalogRuntimeEntry } from "./model-catalog-view-DWAQHc1p.mjs";
import { n as readRecentSessionUsageFromTranscript } from "./session-transcript-usage-Cxv2cU_b.mjs";
import { r as resolveWorkerPlacementModelRuntime } from "./placement-session-runtime-PDZExznz.mjs";
//#region src/gateway/session-utils-projection.ts
function buildSessionListRowMetadataContext(params) {
	const subagentRuns = params.subagentRuns ?? buildSubagentSessionListReadIndex(params.now, params.sessionKeys);
	const projectedAgentRuns = params.projectedAgentRuns ?? buildProjectedAgentRunIndex();
	const catalogEntries = /* @__PURE__ */ new WeakMap();
	const runtimeEntries = /* @__PURE__ */ new WeakMap();
	return {
		subagentRuns,
		projectedAgentRuns,
		projectedSubagentActivity: buildProjectedSubagentActivity(subagentRuns, projectedAgentRuns),
		subagentRunsByChildSessionKey: subagentRuns.runsByChildSessionKey,
		configuredDefaultModelByAgent: /* @__PURE__ */ new Map(),
		thinkingFactsByModelRef: /* @__PURE__ */ new Map(),
		findModelCatalogEntry: (catalog, query) => {
			let entries = catalogEntries.get(catalog);
			if (!entries) {
				entries = /* @__PURE__ */ new Map();
				catalogEntries.set(catalog, entries);
			}
			const key = createSessionRowModelCacheKey(query.provider, query.modelId);
			if (!entries.has(key)) entries.set(key, findModelCatalogEntry(catalog, query));
			return entries.get(key);
		},
		selectModelCatalogRuntimeEntry: (selection) => {
			let entries = runtimeEntries.get(selection.routeVariants);
			if (!entries) {
				entries = /* @__PURE__ */ new Map();
				runtimeEntries.set(selection.routeVariants, entries);
			}
			const key = `${selection.runtimeId}\0${createSessionRowModelCacheKey(selection.entry.provider, selection.entry.id)}`;
			let selected = entries.get(key);
			if (!selected) {
				selected = selectModelCatalogRuntimeEntry(selection);
				entries.set(key, selected);
			}
			return selected;
		},
		displayModelIdentityByKey: /* @__PURE__ */ new Map(),
		modelCostConfigByModelRef: /* @__PURE__ */ new Map(),
		userProfileIdentityById: params.userProfileIdentityById ?? /* @__PURE__ */ new Map()
	};
}
/** Prepare follow-up ancestor membership with the indexes, outside per-row presentation. */
function buildProjectedSubagentActivity(subagentRuns, projectedAgentRuns) {
	const active = /* @__PURE__ */ new Set();
	for (const key of iterateProjectedAgentRunSessionKeys(projectedAgentRuns)) {
		const run = subagentRuns.latestRunsByChildSessionKey.get(key);
		if (!run) continue;
		let requester = run.requesterSessionKey;
		while (requester && !active.has(requester)) {
			active.add(requester);
			requester = subagentRuns.latestRunsByChildSessionKey.get(requester)?.requesterSessionKey ?? "";
		}
	}
	return active;
}
function resolveTranscriptUsageFallbacks(params) {
	const { entry, agentId } = params;
	const fallbacks = /* @__PURE__ */ new Map();
	let snapshot;
	for (const fallbackModelRef of new Set(params.fallbackModelRefs)) {
		fallbacks.set(fallbackModelRef, null);
		if (!entry?.sessionId) continue;
		const resolvedModel = resolveSessionModelIdentityRef(params.cfg, entry, agentId, fallbackModelRef, { allowPluginNormalization: params.allowPluginNormalization });
		if (params.freshTotalTokens !== void 0 && resolveEstimatedSessionCostUsd({
			cfg: params.cfg,
			provider: resolvedModel.provider,
			model: resolvedModel.model,
			entry,
			rowContext: params.rowContext
		}) !== void 0) continue;
		if (snapshot === void 0) {
			const storePath = resolveConcreteSessionStorePath(params.storePath) ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
			try {
				snapshot = readRecentSessionUsageFromTranscript({
					agentId: params.storeAgentId ?? agentId,
					sessionEntry: entry,
					sessionId: entry.sessionId,
					sessionKey: params.key,
					storePath
				}, typeof params.maxTranscriptBytes === "number" ? params.maxTranscriptBytes : 262144);
			} catch {
				snapshot = null;
			}
		}
		if (snapshot) {
			const estimatedCostUsd = resolveEstimatedSessionCostUsd({
				cfg: params.cfg,
				provider: snapshot.modelProvider ?? resolvedModel.provider,
				model: snapshot.model ?? resolvedModel.model,
				explicitCostUsd: snapshot.costUsd,
				entry: snapshot,
				rowContext: params.rowContext
			});
			fallbacks.set(fallbackModelRef, {
				totalTokens: resolvePositiveNumber(snapshot.totalTokens),
				totalTokensFresh: snapshot.totalTokensFresh === true,
				estimatedCostUsd
			});
		}
	}
	return fallbacks;
}
/** Runtime ownership is independent of whether the model itself can change. */
function resolveGatewaySessionRuntimeSelectionLocked(entry, acpMeta) {
	return entry?.modelSelectionLocked === true || acpMeta != null;
}
function resolveGatewaySessionRuntimeProjection(params) {
	const { cfg, agentId, sessionKey, entry } = params;
	const acpMeta = entry?.acp ?? (entry ? readAcpSessionMetaForEntry({
		cfg,
		sessionKey,
		agentId,
		entry
	}) : readAcpSessionMeta({
		sessionKey,
		agentId
	}));
	const agentRuntime = resolveCurrentSessionAgentRuntimeMetadata({
		cfg: params.cfg,
		agentScope: {
			kind: "prepared",
			agentId: params.agentId
		},
		provider: params.provider,
		model: params.model,
		sessionKey: params.sessionKey,
		sessionEntry: params.entry,
		acpRuntime: acpMeta != null,
		acpBackend: acpMeta?.backend
	});
	if (agentRuntime.id === "auto" && entry) agentRuntime.id = resolveWorkerPlacementModelRuntime({
		...params,
		entry,
		preparedEnvironment: params.rowContext ? params.rowContext.workerPlacementEnvironment ??= captureRuntimeStateEnvironment() : void 0
	});
	return {
		acpMeta,
		agentRuntime,
		runtimeSelectionLocked: resolveGatewaySessionRuntimeSelectionLocked(entry, acpMeta)
	};
}
//#endregion
export { resolveTranscriptUsageFallbacks as a, resolveGatewaySessionRuntimeSelectionLocked as i, buildSessionListRowMetadataContext as n, resolveGatewaySessionRuntimeProjection as r, buildProjectedSubagentActivity as t };
